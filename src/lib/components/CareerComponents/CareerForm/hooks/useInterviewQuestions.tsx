import { useState, useEffect } from 'react'
import axios from 'axios'
import { guid, errorToast, interviewQuestionCategoryMap, candidateActionToast } from '@/lib/Utils'

/**
 * Custom hook for managing interview questions generation and CRUD operations
 */
export function useInterviewQuestions(
  questions: any[],
  setQuestions: (questions: any[]) => void,
  jobTitle: string,
  description: string
) {
  const questionCount = 5
  const [showQuestionModal, setShowQuestionModal] = useState('')
  const [questionModalGroupId, setQuestionModalGroupId] = useState(0)
  const [questionModalQuestion, setQuestionModalQuestion] = useState<any>(null)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [questionGenPrompt, setQuestionGenPrompt] = useState('')

  function addQuestion(groupId: number, newQuestion: string) {
    const categoryIndex = questions.findIndex((q) => q.id === groupId)
    if (categoryIndex !== -1) {
      const updatedQuestions = [...questions]
      updatedQuestions[categoryIndex].questions = [
        ...updatedQuestions[categoryIndex].questions,
        {
          id: guid(),
          question: newQuestion,
        },
      ]

      updatedQuestions[categoryIndex].questionCountToAsk = updatedQuestions[categoryIndex].questions.length

      setQuestions(updatedQuestions)
    }
  }

  function editQuestion(groupId: number, updatedQuestion: string, questionId: string) {
    const categoryIndex = questions.findIndex((q) => q.id === groupId)

    const updatedQuestions = [...questions]
    if (categoryIndex !== -1) {
      updatedQuestions[categoryIndex].questions = updatedQuestions[categoryIndex].questions.map((q) =>
        q.id === questionId ? { ...q, question: updatedQuestion } : q
      )
    }

    setQuestions(updatedQuestions)
  }

  function deleteQuestion(groupId: number, questionId: string) {
    const categoryIndex = questions.findIndex((q) => q.id === groupId)
    const updatedQuestions = [...questions]

    if (categoryIndex !== -1) {
      let categoryToUpdate = updatedQuestions[categoryIndex]
      categoryToUpdate.questions = categoryToUpdate.questions.filter(
        (q) => q.id !== questionId
      )
      if (
        categoryToUpdate.questionCountToAsk !== null &&
        categoryToUpdate.questionCountToAsk > categoryToUpdate.questions.length
      ) {
        categoryToUpdate.questionCountToAsk = categoryToUpdate.questions.length
      }
    }
    setQuestions(updatedQuestions)
  }

  async function generateAllQuestions() {
    try {
      if (!jobTitle.trim() || !description.trim()) {
        errorToast('Please fill in all fields', 1500)
        return
      }

      setIsGeneratingQuestions(true)

      const interviewCategories = Object.keys(interviewQuestionCategoryMap)
      const response = await axios.post('/api/llm-engine', {
        systemPrompt:
          'You are a helpful assistant that can answer questions and help with tasks.',
        prompt: `Generate ${questionCount * interviewCategories.length} interview questions for the following Job opening:
        Job Title:
        ${jobTitle}
        Job Description:
        ${description}

        ${interviewCategories
          .map((category) => {
            return `Category:
          ${category}
          Category Description:
          ${interviewQuestionCategoryMap[category].description}`
          })
          .join('\n')}

        ${interviewCategories
          .map((category) => `${questionCount} questions for ${category}`)
          .join(', ')}

        ${
          questions.reduce((acc, group) => acc + group.questions.length, 0) > 0
            ? `Do not generate questions that are already covered in this list:\n${questions
                .map((group) =>
                  group.questions
                    .map(
                      (question: any, index: number) =>
                        `          ${index + 1}. ${question.question}`
                    )
                    .join('\n')
                )
                .join('\n')}`
            : ''
        }

        return it in json format following this for each element {category: "category", questions: ["question1", "question2", "question3", "question4", "question5"]}
        return only the json array, nothing else, now markdown format just pure json code.
        `,
      })

      let finalGeneratedQuestions = response.data.result

      finalGeneratedQuestions = finalGeneratedQuestions.replace('```json', '')
      finalGeneratedQuestions = finalGeneratedQuestions.replace('```', '')

      finalGeneratedQuestions = JSON.parse(finalGeneratedQuestions)
      console.log(finalGeneratedQuestions)

      let newArray = [...questions]

      finalGeneratedQuestions.forEach((questionGroup: any) => {
        const categoryIndex = newArray.findIndex(
          (q) => q.category === questionGroup.category
        )

        if (categoryIndex !== -1) {
          const newQuestions = questionGroup.questions.map((q: string) => ({
            id: guid(),
            question: q,
          }))
          newArray[categoryIndex].questions = [
            ...newArray[categoryIndex].questions,
            ...newQuestions,
          ]
          newArray[categoryIndex].questionCountToAsk = newArray[categoryIndex].questions.length
        }
      })

      setQuestions(newArray)

      candidateActionToast(
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#181D27',
            marginLeft: 8,
          }}
        >
          Questions generated successfully
        </span>,
        1500,
        <i
          className='la la-check-circle'
          style={{ color: '#039855', fontSize: 32 }}
        ></i>
      )
    } catch (err) {
      console.log(err)
      errorToast('Error generating questions, please try again', 1500)
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  async function generateQuestions(groupCategory: string) {
    try {
      if (!jobTitle.trim() || !description.trim()) {
        errorToast('Please fill in all fields', 1500)
        return
      }

      setIsGeneratingQuestions(true)

      const interviewQuestionCategory = interviewQuestionCategoryMap[groupCategory]
      const response = await axios.post('/api/llm-engine', {
        systemPrompt:
          'You are a helpful assistant that can answer questions and help with tasks.',
        prompt: `Generate ${questionCount} interview questions for the following Job opening:
          Job Title:
          ${jobTitle}
          Job Description:
          ${description}

          Interview Category:
          ${groupCategory}
          Interview Category Description:
          ${interviewQuestionCategory.description}

          The ${questionCount} interview questions should be related to the job description and follow the scope of the interview category.

          ${
            questions.reduce((acc, group) => acc + group.questions.length, 0) > 0
              ? `Do not generate questions that are already covered in this list:\n${questions
                  .map((group) =>
                    group.questions
                      .map(
                        (question: any, index: number) =>
                          `          ${index + 1}. ${question.question}`
                      )
                      .join('\n')
                  )
                  .join('\n')}`
              : ''
          }

          return it as a json object following this format for the category {category: "${groupCategory}", questions: ["question1", "question2", "question3"]}

          ${questionGenPrompt}
          `,
      })

      let finalGeneratedQuestions = response.data.result

      finalGeneratedQuestions = finalGeneratedQuestions.replace('```json', '')
      finalGeneratedQuestions = finalGeneratedQuestions.replace('```', '')

      finalGeneratedQuestions = JSON.parse(finalGeneratedQuestions)
      console.log(finalGeneratedQuestions)

      let newArray = [...questions]

      const categoryIndex = newArray.findIndex(
        (q) => q.category === finalGeneratedQuestions.category
      )

      if (categoryIndex !== -1) {
        const newQuestions = finalGeneratedQuestions.questions.map((q: string) => ({
          id: guid(),
          question: q,
        }))
        newArray[categoryIndex].questions = [
          ...newArray[categoryIndex].questions,
          ...newQuestions,
        ]
        newArray[categoryIndex].questionCountToAsk = newArray[categoryIndex].questions.length
      }

      setQuestions(newArray)

      candidateActionToast(
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#181D27',
            marginLeft: 8,
          }}
        >
          Questions generated successfully
        </span>,
        1500,
        <i
          className='la la-check-circle'
          style={{ color: '#039855', fontSize: 32 }}
        ></i>
      )
    } catch (err) {
      console.log(err)
      errorToast('Error generating questions, please try again', 1500)
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  function handleReorderCategories(draggedCategoryId: number, dropIndex: number) {
    const updatedQuestions = [...questions]
    const draggedCategoryIndex = updatedQuestions.findIndex(
      (q) => q.id === draggedCategoryId
    )
    const draggedCategory = updatedQuestions[draggedCategoryIndex]

    updatedQuestions.splice(draggedCategoryIndex, 1)
    updatedQuestions.splice(dropIndex, 0, draggedCategory)
    setQuestions(updatedQuestions)
  }

  function handleReorderQuestions(
    draggedQuestionId: string,
    fromCategoryId: number,
    toCategoryId: number,
    insertIndex?: number
  ) {
    const updatedQuestions = [...questions]

    const fromCategoryIndex = updatedQuestions.findIndex((q) => q.id === fromCategoryId)
    const categoryOrigin = updatedQuestions[fromCategoryIndex]
    const questionIndex = categoryOrigin.questions.findIndex(
      (q) => q.id.toString() === draggedQuestionId
    )
    const questionToMove = categoryOrigin.questions[questionIndex]

    categoryOrigin.questions.splice(questionIndex, 1)

    if (fromCategoryId === toCategoryId) {
      const targetIndex = insertIndex ?? 0
      categoryOrigin.questions.splice(targetIndex, 0, questionToMove)
    } else {
      const toCategoryIndex = updatedQuestions.findIndex((q) => q.id === toCategoryId)
      updatedQuestions[toCategoryIndex].questions.push(questionToMove)

      if (
        categoryOrigin.questionCountToAsk !== null &&
        categoryOrigin.questionCountToAsk > categoryOrigin.questions.length
      ) {
        categoryOrigin.questionCountToAsk = categoryOrigin.questions.length
      }
    }

    setQuestions(updatedQuestions)
  }

  async function fetchInstructionPrompt() {
    const configData = await axios
      .post('/api/fetch-global-settings', {
        fields: { question_gen_prompt: 1 },
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        console.log('[Question Generator Fetch Prompt Error]', err)
      })

    if (configData?.question_gen_prompt?.prompt) {
      setQuestionGenPrompt(configData.question_gen_prompt.prompt)
    }
  }

  useEffect(() => {
    fetchInstructionPrompt()
  }, [])

  return {
    isGeneratingQuestions,
    showQuestionModal,
    setShowQuestionModal,
    questionModalGroupId,
    setQuestionModalGroupId,
    questionModalQuestion,
    setQuestionModalQuestion,
    addQuestion,
    editQuestion,
    deleteQuestion,
    generateAllQuestions,
    generateQuestions,
    handleReorderCategories,
    handleReorderQuestions,
  }
}
