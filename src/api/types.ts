export interface User {
  user_id: string;
  username: string;
  avatar_url: string
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  avatar_url: string
}


export interface MyTest{
    id: string;
    nomi: string;
    savollar_soni: number
    submissionlar_soni: number
    created_at: string
}


export interface UpdateTestNameDto{
    nomi: string;
}


export interface TestSubmission{
    id: string;
    testName: string;
    test: string;
    created_at: string;
    total_count: number
    correct_count: number
}

export interface Question {
  id: string
  title: string
  answers: Array<{
    title: string | number
    is_correct: boolean
  }>
  created_at: string
}


export interface TestFullResponseDto {
  id: string
  nomi: string
  questions: Question[]
  created_at: string
  creator: string
}


export interface Answer{
    id: string
    title: string | number
    is_correct: boolean
}

export interface TestSubmissionDetails{
    id: string;
    testName: string;
    created_at: string;
    correct_count: number
    total_count: number
    selected_answers: Array<{
        id: string
        question: Question
        answer: Answer
        question_title: string
        answer_title: string
        correct_answer_title: string
        is_correct: boolean
    }>
}