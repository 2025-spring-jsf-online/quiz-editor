import { Component, OnInit } from '@angular/core';
import { QuizService, QuizFromWeb } from './quiz.service';

import {
  trigger,
  transition,
  animate,
  keyframes,
  style,
} from '@angular/animations';

interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
  markedForDelete: boolean;
  newlyAddedQuiz: boolean;
  naiveQuizChecksum: string;
}

interface QuestionDisplay {
  questionName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  animations: [
    trigger('detailsFromLeft', [
      transition('leftPosition => finalPosition', [
        animate(
          '300ms',
          keyframes([
            style({ marginLeft: '-30px', offset: 0.0 }),
            style({ marginLeft: '-20px', offset: 0.25 }),
            style({ marginLeft: '-10px', offset: 0.5 }),
            style({ marginLeft: '-5px', offset: 0.75 }),
            style({ marginLeft: '0px', offset: 1.0 }),
          ])
        ),
      ]),
    ]),
    trigger('pulseSaveCancelButtons', [
      transition('nothingToSave => somethingToSave', [
        animate(
          '400ms',
          keyframes([
            style({
              transform: 'scale(1.0)',
              'transform-origin': 'top left',
              offset: 0.0,
            }),
            style({
              transform: 'scale(1.2)',
              'transform-origin': 'top left',
              offset: 0.5,
            }),
            style({
              transform: 'scale(1.0)',
              'transform-origin': 'top left',
              offset: 1.0,
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';

  constructor(public quizSvc: QuizService) {}

  loading = true;
  errorLoadingQuizzes = false;

  generateNaiveQuizchecksum = (quiz: QuizFromWeb) => {
    return quiz.name + quiz.questions.map((x) => '~' + x.name).join('');
  };

  loadQuizzesFromCloud = async () => {
    try {
      const quizzes = (await this.quizSvc.loadQuizzes()) ?? [];

      console.log(quizzes);

      this.quizzes = quizzes.map((x) => ({
        quizName: x.name,
        quizQuestions: x.questions.map((y) => ({
          questionName: y.name,
        })),
        markedForDelete: false,
        newlyAddedQuiz: false,
        naiveQuizChecksum: this.generateNaiveQuizchecksum(x),
      }));
      this.loading = false;
    } catch (err) {
      console.error(err);
      this.errorLoadingQuizzes = true;
      this.loading = false;
    }
  };

  ngOnInit(): void {
    this.loadQuizzesFromCloud();
  }

  quizzes: QuizDisplay[] = [];

  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (q: QuizDisplay) => {
    this.selectedQuiz = q;

    console.log(this.selectedQuiz);

    this.detailsFromLeftAnimationState = 'finalPosition';
  };

  addNewQuiz = () => {
    const newQuiz = {
      quizName: ' Untitled Quiz',
      quizQuestions: [],
      markedForDelete: false,
      newlyAddedQuiz: true,
      naiveQuizChecksum: '',
    };

    this.quizzes = [...this.quizzes, newQuiz];

    this.selectedQuiz = newQuiz;
  };

  addNewQuestion = () => {
    if (this.selectedQuiz) {
      this.selectedQuiz.quizQuestions = [
        ...this.selectedQuiz.quizQuestions,
        {
          questionName: 'Untitiled Question',
        },
      ];
    }
  };

  removeQuestion = (questionToRemove: QuestionDisplay) => {
    if (this.selectedQuiz) {
      this.selectedQuiz.quizQuestions = this.selectedQuiz.quizQuestions.filter(
        (x) => x !== questionToRemove
      );
    }
  };

  jsPromiseOne = () => {
    const n = this.quizSvc.getMagicNumber(true);
    console.log(n); // ????

    n.then((number) => {
      console.log(number);

      const n2 = this.quizSvc.getMagicNumber(true);
      console.log(n2);

      n2.then((x) => console.log(x)).catch((e) => console.error(e));
    }).catch((err) => {
      console.error(err);
    });
  };

  jsPromiseTwo = async () => {
    try {
      const x = await this.quizSvc.getMagicNumber(true);
      console.log(x); // ???

      const y = await this.quizSvc.getMagicNumber(true);

      console.log(y); // ???
    } catch (err) {
      console.error(err);
    }
  };

  jsPromiseThree = async () => {
    try {
      const x = this.quizSvc.getMagicNumber(true);
      console.log(x); // ???

      const y = this.quizSvc.getMagicNumber(true);

      console.log(y); // ???

      const results = await Promise.all([x, y]);
      //const results = await Promise.race([x, y]); //The first one to resolve gets assigned

      console.log(results); // ???
    } catch (err) {
      console.error(err);
    }
  };

  cancelAllChanges = () => {
    this.loadQuizzesFromCloud();
    this.selectedQuiz = undefined;
  };

  getDeletedQuizzes = () => {
    return this.quizzes.filter((x) => x.markedForDelete);
  };

  get deletedQuizCount() {
    return this.getDeletedQuizzes().length;
  }

  getNewlyAddedQuizzes = () => {
    return this.quizzes.filter((x) => x.newlyAddedQuiz && !x.markedForDelete);
  };

  get addedQuizCount() {
    return this.getNewlyAddedQuizzes().length;
  }

  getEditedQuizzes = () => {
    return this.quizzes.filter(
      (x) =>
        x.quizName +
          x.quizQuestions.map((y) => '~' + y.questionName).join('') !==
          x.naiveQuizChecksum &&
        !x.newlyAddedQuiz &&
        !x.markedForDelete
    );
  };

  get editedQuizCount() {
    return this.getEditedQuizzes().length;
  }

  detailsFromLeftAnimationState = 'leftPosition';

  detailsFromLeftAnimationDone = () => {
    this.detailsFromLeftAnimationState = 'leftPosition';
  };
}
