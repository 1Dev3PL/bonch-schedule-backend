import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as cheerio from 'cheerio';
import { eachWeekOfInterval } from 'date-fns';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type PairType = {
  faculty: string;
  group: string;
  date: string;
  dayOfWeek: string;
  pairNum: string;
  pairStart: string;
  pairEnd: string;
  pairTitle: string;
  teacher: string;
  auditory: string;
  pairType: string;
};

type GroupType = {
  facultyTitle: string;
  groupId: number;
};

type StoreType = {
  groups: {
    [groupTitle: string]: GroupType;
  };
  schedule: PairType[];
};

@Injectable()
export class ParserService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  //Хранилище групп и распсания
  private store: StoreType = {
    groups: {},
    schedule: [],
  };

  async getHTML(url: string) {
    const { data } = await firstValueFrom(this.httpService.get(url));
    return cheerio.load(data);
  }

  //Засетать группы в store
  async parseGroups() {
    const $ = await this.getHTML(
      'https://www.sut.ru/studentu/raspisanie/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya',
    );

    $('.vt252').each((i, faculty) => {
      const facultyTitle = $(faculty).find($('.vt253')).text().trim();

      $(faculty)
        .find($('.vt256'))
        .each((i, group) => {
          const groupTitle = $(group).text().trim();
          const groupId = Number($(group).attr('data-i'));
          this.store.groups[groupTitle] = {
            facultyTitle,
            groupId,
          };
        });
    });
  }

  //Получить расписание для группы на семестр
  private async parseSchedule() {
    //Пока сделал для одной группы и на последний месяц
    const group = 'ИКТ-211';
    const faculty = this.store.groups[group].facultyTitle;
    const groupId = this.store.groups[group].groupId;
    const weeks = eachWeekOfInterval(
      {
        start: new Date('2023/05/01'),
        end: new Date('2023/06/01'),
      },
      { weekStartsOn: 2 },
    ).map((d) => d.toISOString().split('T')[0]);

    for (const i in weeks) {
      const currentDate = weeks[i];
      const $ = await this.getHTML(
        `https://www.sut.ru/studentu/raspisanie/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya?group=${groupId}&date=${currentDate}`,
      );

      $('.vt237')
        .slice(1)
        .each((currCol, column) => {
          const rawDate = $(column)
            .text()
            .replace($(column).find('.vt238').text(), '')
            .trim();
          const dateDDMM = rawDate.split('.');
          const date = `${new Date().getFullYear()}-${dateDDMM[1]}-${
            dateDDMM[0]
          }`;
          const dayOfWeek = $(column).find('.vt238').text().trim();

          $('.vt244b')
            .find('.vt244')
            .each((currRow, row) => {
              const pairNumAndTime = $(row).find('.vt239').eq(0);
              const pairNum = pairNumAndTime.find('.vt283').text();
              const pairTime = pairNumAndTime
                .text()
                .replace(pairNum, '')
                .match(/[0-9]{2}:[0-9]{2}/g);
              const pairStart = pairTime[0];
              const pairEnd = pairTime[1];
              const pairsOnTime = $(row)
                .find('.vt239')
                .slice(1)
                .eq(currCol)
                .find('.vt258');
              pairsOnTime.each((currPair, pair) => {
                const pairTitle = $(pair).find('.vt240').text().trim();
                const teacher = $(pair).find('.vt241').text().trim();
                const auditory = $(pair).find('.vt242').text().trim();
                const pairType = $(pair).find('.vt243').text().trim();

                this.store.schedule.push({
                  faculty,
                  group,
                  date,
                  dayOfWeek,
                  pairNum,
                  pairStart,
                  pairEnd,
                  pairTitle,
                  teacher,
                  auditory,
                  pairType,
                });
              });
            });
        });
    }

    await this.prisma.schedule.createMany({
      data: this.store.schedule,
    });
  }

  async parse() {
    await this.parseGroups();
    await this.parseSchedule();
  }

  async getSchedule() {
    const data = await this.prisma.schedule.findMany();
    return {
      data,
    };
  }
}
