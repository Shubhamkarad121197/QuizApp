import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from 'src/app/service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  public name:string="";
  public questionList: any=[];
  public currentQuestion:number=0;
  public points:number=0;
  counter=15;
  correctAnswer:number=0;
  wrongAnswer:number=0;
  interval$:any;
  progress:string="0";
  isQuizCompleted:boolean=false;



  constructor(private questionService : QuestionService) { }

  ngOnInit(): void {
    this.name=localStorage.getItem("name")!;
    this.getAllQuestion();
    this.startCounter();
  }
  getAllQuestion(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      this.questionList=res.questions;
    })

  }
  nextQuestion()
  {
    this.currentQuestion++;

  }
  previousQuestion()
  {
    this.currentQuestion--;
  
  }
  answer(currentQno:number,option:any){
    if(currentQno===this.questionList.length){
      this.isQuizCompleted=true;
      this.stopCounter();
    }
    if(option.correct){
      this.points+=10;
      this.correctAnswer++;
      setTimeout(()=>{
      this.currentQuestion++;
      this.resetCounter();
      this.getProgressPercent();

      },1000)
      
    }
    else{
      setTimeout(()=>{
        this.points-=5;
      this.currentQuestion++;
      this.wrongAnswer++;
      this.getProgressPercent();

      },1000)
      
    }

  }
  startCounter(){
    this.interval$=interval(1000).subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=15;
        this.points-=10;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();
    },15000);


  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetCounter(){
    this.stopCounter();
    this.counter=15;
    this.startCounter();

  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestion();
    this.points=0;
    this.counter=15;
    this.currentQuestion=0;
    this.progress="0"
  }
  getProgressPercent(){
    this.progress=((this.currentQuestion/this.questionList.length)*100).toString()
    return this.progress;
  }

}
