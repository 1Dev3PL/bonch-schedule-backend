import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import eachWeekOfInterval from 'date-fns/eachWeekOfInterval';

@Injectable()
export class ParserService {
  constructor(private prisma: PrismaService) {}

  private readonly URL: 'https://www.sut.ru/studentu/raspisanie/raspisanie-zanyatiy-studentov-ochnoy-i-vecherney-form-obucheniya';
  private store: any = {
    groups: {},
    schedule: [],
  }; //Хранилище групп и распсания

  private async getHTML(url: string) {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  }

  //Засетать группы в store
  private async getGroups() {
    const $ = await this.getHTML(this.URL);

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
  private async getSchedule() {
    const group = 'ИКТ-211';
    const faculty = this.store.groups[group].facultyTitle;
    const groupId = this.store.groups[group].groupId;
    const weeks = eachWeekOfInterval(
      {
        start: new Date('2023/02/01'),
        end: new Date('2023/6/15'),
      },
      { weekStartsOn: 2 },
    ).map((d) => d.toISOString().split('T')[0]);

    for (const i in weeks) {
      const currentDate = weeks[i];
      const $ = await this.getHTML(
        `${URL}?group=${groupId}&date=${currentDate}`,
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

    this.prisma.schedule.createMany({
      data: this.store.schedule,
    });
  }

  async parse() {
    await this.getGroups();
    await this.getSchedule();
  }

  async getTest() {
    const data = await axios.get(
      'https://jsonplaceholder.typicode.com/posts/1',
    );
    console.log(data);

    return {
      data,
    };
  }

  async getData() {
    const table = await this.prisma.schedule.findMany();
    return {
      table,
    };
  }
}
