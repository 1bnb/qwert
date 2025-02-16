import { CHAPTER_LENGTH } from '@/constants'
import { currentChapterAtom, currentDictInfoAtom, reviewModeInfoAtom } from '@/store'
import type { Word, WordWithIndex } from '@/typings/index'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { useAtom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import useSWR from 'swr'

export type UseWordListResult = {
  words: WordWithIndex[]
  isLoading: boolean
  error: Error | undefined
}

/**
 * Use word lists from the current selected dictionary.
 */
export function useWordList(): UseWordListResult {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const { isReviewMode, reviewRecord } = useAtomValue(reviewModeInfoAtom)

  // Reset current chapter to 0, when currentChapter is greater than chapterCount.
  if (currentChapter >= currentDictInfo.chapterCount) {
    setCurrentChapter(0)
  }

  const isFirstChapter = !isReviewMode && currentDictInfo.id === 'sentence' && currentChapter === 0
  const { data: wordList, error, isLoading } = useSWR(currentDictInfo.url, wordListFetcher)

  const words: WordWithIndex[] = useMemo(() => {
    let newWords: Word[]
    if (isFirstChapter) {
      newWords = firstChapter
    } else if (isReviewMode) {
      newWords = reviewRecord?.words ?? []
    } else if (wordList) {
      newWords = wordList.slice(currentChapter * CHAPTER_LENGTH, (currentChapter + 1) * CHAPTER_LENGTH)
    } else {
      newWords = []
    }

    // 记录原始 index, 并对 word.trans 做兜底处理
    return newWords.map((word, index) => {
      let trans: string[]
      if (Array.isArray(word.trans)) {
        trans = word.trans.filter((item) => typeof item === 'string')
      } else if (word.trans === null || word.trans === undefined || typeof word.trans === 'object') {
        trans = []
      } else {
        trans = [String(word.trans)]
      }
      return {
        ...word,
        index,
        trans,
      }
    })
  }, [isFirstChapter, isReviewMode, wordList, reviewRecord?.words, currentChapter])

  return { words, isLoading, error }
}

const firstChapter = [
  {
    name: 'The celebrated theory is still the source of great controversy.',
    trans: ['这一著名的理论至今仍是巨大争议的根源。'],
  },
  {
    name: 'A good architectural structure should be useful, durable and beautiful.',
    trans: ['一个好的建筑结构应该实用、耐用、美观。'],
  },
  {
    name: 'A group meeting will be held tomorrow in the library conference room.',
    trans: ['明天将在图书馆会议室举行小组会议。'],
  },
  {
    name: 'A number of students have volunteer jobs.',
    trans: ['许多学生从事志愿工作。'],
  },
  {
    name: 'We can all meet at my office after the lecture.',
    trans: ['讲座结束后我们可以在我的办公室见面。'],
  },
  {
    name: 'Tutorials are scheduled in the final week of the term.',
    trans: ['辅导课安排在学期的最后一周。'],
  },
  {
    name: 'You can make an appointment to meet the librarian.',
    trans: ['你可以和图书管理员约个时间。'],
  },
  {
    name: 'Affordable housing is an important issue for all members of society.',
    trans: ['经济适用房对社会所有成员来说都是一个重要问题。'],
  },
  {
    name: 'Agenda items should be submitted by the end of the day.',
    trans: ['议程项目应在当天结束前提交。'],
  },
  {
    name: 'All dissertations must be accompanied by a submission form.',
    trans: ['所有论文必须附上提交表格。'],
  },
  {
    name: 'All industries are a system of inputs, processes, outputs and feedback.',
    trans: ['所有行业都是一个输入、处理、输出和反馈的系统。'],
  },
  {
    name: 'All of the assignments must be submitted in person to the faculty office.',
    trans: ['所有作业必须亲自提交到学院办公室 / 教职员工办公室。'],
  },
  {
    name: 'Economic development needs to be supported by the government.',
    trans: ['经济发展需要政府的支持。'],
  },
  {
    name: 'All of your assignments are due by tomorrow.',
    trans: ['你明天应该交所有的作业。'],
  },
  {
    name: 'The toughest part of postgraduate education is funding.',
    trans: ['研究生教育最困难的部分是资金。'],
  },
  {
    name: 'Our view is that educational reforms have been inadequately implemented.',
    trans: ['我们的看法是，教育改革执行得不够充分。'],
  },
  {
    name: 'Although sustainable development is not easy, it is an unavoidable responsibility.',
    trans: ['可持续发展虽然不容易，但是一项不可推卸的责任。'],
  },
  {
    name: 'Americans have typically defined the process of plant growth in quantitative terms.',
    trans: ['美国人通常用定量术语来定义植物生长的过程。'],
  },
  {
    name: 'An introduction is an essential element of presentation.',
    trans: ['简介是演讲的基本要素。'],
  },
  {
    name: 'The assignments should be submitted to the department office before the deadlines.',
    trans: ['作业须于截止日期前送交系办公室。'],
  },
]
