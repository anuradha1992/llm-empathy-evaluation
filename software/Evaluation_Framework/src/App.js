import React from 'react';
//import jsonData from './json/rephrased_data.json';
import jsonData from './json/empatheticdialogues_human_chatgpt.json';
import screenshot from './images/screenshot.png';
import './App.css';
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//import Dropdown from 'react-dropdown';
//import 'react-dropdown/style.css';

//import Select from "react-dropdown-select";
import Select from 'react-select'

//var RNFS = require('react-native-fs');

const total_hits = jsonData.data.length;
const workers_per_hit = 1;
//const max_hits_per_worker = 15;
const pay_per_batch = 2.25;
const dialogs_per_hit = 10;
//const bonus_per_batch = 2;

//const defaultIntent = MI_intents[-1];

const copy_code = "<PROLIFIC-COMPLETION-CODE>"
const redirect_url = "https://app.prolific.com/submissions/complete?cc=<PROLIFIC-COMPLETION-CODE>"


const examples = [

  {
    "emotion": "Disappointed",
    "speaker": "I had to cancel our family vacation coming up next month.",
    "listener": "I am really sorry to hear that. I hope everything is alright.",
  },
  {
    "emotion": "Afraid",
    "speaker": "Some random dude walked into my room while I was laying down, couldn't have been more weird",
    "listener": "Oh wow that is weird. Did you say anything to him?",
  },
  {
    "emotion": "Prepared",
    "speaker": "I'm 38 weeks pregnant, could have my baby any day now!",
    "listener": "Congrats! Thats so exciting do You feel okay?",
  },
  {
    "emotion": "Anticipating",
    "speaker": "This week was the last one for this semester of my college courses.",
    "listener": "That is awesome. What degree are you working towards?",
  },
  {
    "emotion": "Confident",
    "speaker": "I have a presentation for work on Monday. I'm a little nervous.",
    "listener": "Oh, thats not unusual. You must try to relax. Is it an important presentation?.",
  }

]

const toronto_empathy_questionnaire = [

  {
    "question": "When someone else is feeling excited, I tend to get excited too.",
  },
  {
    "question": "Other people’s misfortunes do not disturb me a great deal.",
  },
  {
    "question": "It upsets me to see someone being treated disrespectfully.",
  },
  {
    "question": "I remain unaffected when someone close to me is happy.",
  },
  {
    "question": "I enjoy making other people feel better.",
  },
  {
    "question": "I have tender, concerned feelings for people less fortunate than me.",
  },
  {
    "question": "When a friend starts to talk about his or her problems, I try to steer the conversation towards something else.",
  },
  {
    "question": "I can tell when others are sad even when they do not say anything.",
  },
  {
    "question": "I find that I am “in tune” with other people’s moods.",
  },
  {
    "question": "I do not feel sympathy for people who cause their own serious illnesses.",
  },
  {
    "question": "I become irritated when someone cries.",
  },
  {
    "question": "I am not really interested in how other people feel.",
  },
  {
    "question": "I get a strong urge to help when I see someone who is upset.",
  },
  {
    "question": "When I see someone being treated unfairly, I do not feel very much pity for them.",
  },
  {
    "question": "I find it silly for people to cry out of happiness.",
  },
  {
    "question": "When I see someone being taken advantage of, I feel kind of protective towards him or her.",
  }
]

const ED_color = {
            'prepared': '#fb8c00',
            'anticipating': '#ffa726',
            'hopeful': '#ffcc80',
            'proud': '#FFE18F',

            'excited': '#fdd835',
            'joyful': '#ffee58',
            'content': '#fff59d',
            'caring': '#F3F29D',

            'grateful': '#c0ca33',
            'trusting': '#d4e157',
            'confident': '#e6ee9c',
            'faithful': '#CCE7BC',

            'impressed': '#03a9f4',
            'surprised': '#29b6f6',

            'terrified': '#00897b',
            'afraid': '#26a69a',
            'apprehensive': '#80cbc4',
            'anxious': '#b2dfdb',

            'embarrassed': '#A3CFF2',
            'ashamed': '#B5DFF8',

            'devastated': '#3949ab',
            'sad': '#5c6bc0',
            'disappointed': '#7986cb',
            'lonely': '#9fa8da',
            'sentimental': '#c5cae9',
            'nostalgic': '#e8eaf6',
            'guilty': '#CA99D9',

            'disgusted': '#ab47bc',

            'furious': '#e53935',
            'angry': '#ef5350',
            'annoyed': '#ef9a9a',
            'jealous': '#F7B38D',
            'neutral': '#efebe9'
            }

class App extends React.Component {
  constructor(props) {

    /*if (window.performance) {
      if (performance.navigation.type == 1) {
        var res = window.confirm( "Any unsubmitted data will be lost if you reload this page. Are you sure you want to reload the page?" );
        if (res) {
          window.location.reload();
        }
        } else {
          // do nothing
        }
      }
    }*/

    window.onbeforeunload = function() {
      return "Any unsubmitted data will be lost if you reload this page. Are you sure you want to reload the page?";
    };


    super(props);

    console.log(props)
    console.log("===")

    console.log(props.part);
    console.log(props.host);
    console.log(props.assignmentId);
    console.log(props.workerId);
    console.log(props.hitId);

    var part = parseInt(props.part);

    var host = props.host;
    var assignmentId = props.assignmentId;
    var workerId = props.workerId;
    var hitId = props.hitId;

    //console.log(jsonData);
    //console.log(jsonData.data);
    //console.log(jsonData.data[0].dialogs);

    console.log(jsonData)
    console.log(jsonData.data)
    console.log(jsonData.data[0])
    console.log(jsonData.data[0].dialogs)

    var toronto_empathy_arr = []

    for (var i = 0; i < toronto_empathy_questionnaire.length; i++) {
      toronto_empathy_arr.push(null)
    }

    console.log("Toronto empathy arr:")
    console.log(toronto_empathy_arr)

    var completed = []
    var inprogress = []

    var completed_names = []
    var inprogress_names = []

    for (var i = 0; i < total_hits; i++) {
      completed.push(0);
      inprogress.push(0);
      completed_names.push([]);
      inprogress_names.push([]);
    }


    this.state = { 

      survey_completed: false,

      position: -1,
      question_no: 0,
      //data: jsonData.data.slice(50),
      data: jsonData.data,
      part_no: part,
      bonus_points: 0,
      host: host,
      assignmentId: assignmentId,
      workerId: workerId,
      hitId: hitId,
      annotator_name: "", 
      annotator_realname: "",
      max_hits_per_worker: -1,
      start_time: "",
      
      intents_arr: [],
      
      toronto_empathy_arr: toronto_empathy_arr,
      filled_toronto_empathy_count: 0,
      
      context_arr: [],
      
      sent_count_arr: [],
      filled_sent_count_arr: [],
      tutorial_reveal: false,
      completed: completed,
      inprogress: inprogress,
      completed_names: completed_names,
      inprogress_names: inprogress_names,
      workers_per_hit: workers_per_hit,
      color_dict: {
        '-2': '#E91E63',
        '-1': '#F06292',
        '0': '#B0BEC5',
        '1': '#66BB6A',
        /*'2': '#43A047'*/
        '2': '#228B22'
      },

      task_proceeded: false,
      
      showSubmitModal: false,
      showSuccessModal: false,
      showErrorModal: false,
    };

  }

  componentDidMount() {

    this.check();

  }

  check() {

    console.log("calling check......");

    //fetch(`${window.location.origin}/emotiobrecog/files`,{
    fetch(`${window.location.origin}/files`,{
      method: 'GET',
      headers : { 
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()).then(res => {
      console.log(res);

      var completed = []
      var inprogress = []
      var completed_names = []
      var inprogress_names = []

      for (var i = 0; i < total_hits; i++) {
        completed.push(0);
        inprogress.push(0);
        completed_names.push([]);
        inprogress_names.push([]);
      }

      for(var k = 0; k < res.completed.length; k++) {
        var arr = res.completed[k].split('-');
        if (arr.length >= 2) {
          completed[parseInt(arr[0])] += 1;
          completed_names[parseInt(arr[0])].push(arr[1].toLowerCase());
        }
      }

      for(var k = 0; k < res.inprogress.length; k++) {
        var arr = res.inprogress[k].split('-');
        if (arr.length >= 2) {
          inprogress[parseInt(arr[0])] += 1;
          inprogress_names[parseInt(arr[0])].push(arr[1].toLowerCase());
        }
      }

      this.setState({
        completed: completed,
        inprogress: inprogress,
        completed_names: completed_names,
        inprogress_names: inprogress_names,
      });

      console.log(this.state.completed);
      console.log(this.state.inprogress);
      console.log(this.state.completed_names);
      console.log(this.state.inprogress_names);

    });

  }

  handleProceed(e) {
    console.log("handleProceed");
    if (e != null) {

        //console.log(e); // {value: 'Closed Question', label: 'Closed Question', className: 'cq'}
        //console.log(e.currentTarget);
        //console.log(e.currentTarget.id);

        //var arr = e.currentTarget.id.split("-");
        //var part = parseInt(arr[1]);
        
        fetch(`${window.location.origin}/emotionrecog/files`,{
        //fetch(`${window.location.origin}/files`,{
          method: 'GET',
          headers : { 
            'Content-Type': 'application/json',
          }
        }).then(res => res.json()).then(res => {
          console.log(res);

          var completed = []
          var inprogress = []
          var completed_names = []
          var inprogress_names = []

          for (var i = 0; i < total_hits; i++) {
            completed.push(0);
            inprogress.push(0);
            completed_names.push([]);
            inprogress_names.push([]);
          }

          for(var k = 0; k < res.completed.length; k++) {
            var arr = res.completed[k].split('-');
            if (arr.length >= 2) {
              completed[parseInt(arr[0])] += 1;
              completed_names[parseInt(arr[0])].push(arr[1].toLowerCase());
            }
          }

          for(var k = 0; k < res.inprogress.length; k++) {
            var arr = res.inprogress[k].split('-');
            if (arr.length >= 2) {
              inprogress[parseInt(arr[0])] += 1;
              inprogress_names[parseInt(arr[0])].push(arr[1].toLowerCase());
            }
          }

          this.setState({
            completed: completed,
            inprogress: inprogress,
            completed_names: completed_names,
            inprogress_names: inprogress_names,
          });

          console.log(this.state.completed);
          console.log(this.state.inprogress);
          console.log(this.state.completed_names);
          console.log(this.state.inprogress_names);

          var part = -1
          var already_completed = false
          //var returning_user_inprogress = false
          //var returning_user_completed = false
          var batch_assigned = false

          for (var i = 0; i < total_hits; i++) {
            if (inprogress[i] >= workers_per_hit && inprogress_names[i].includes(this.state.annotator_name.toLowerCase())) {
              if (completed[i] >= workers_per_hit && completed_names[i].includes(this.state.annotator_name.toLowerCase())) {
                //returning_user_completed = true
                alert("You have already completed rating a batch. Unfortunately, you cannot rate more than 1 batch.");
                already_completed = true
                break
              } else {
                part = i
                batch_assigned = true
                //returning_user_inprogress = true
                console.log("Returning user to annotate inprogress batch. Batch: " + i + " annotator name: " + inprogress_names[i])
                break
              }
            } else if (inprogress[i] == 1 && !inprogress_names[i].includes(this.state.annotator_name.toLowerCase())) {
              console.log("Batch: " + i + " is already chosen to be annotated by " + inprogress_names[i])
              continue
            } else if (inprogress[i] == 0) {
              part = i
              batch_assigned = true
              break
            }
          }

          console.log("Is batch asssigned? ", batch_assigned)

          if (!already_completed && !batch_assigned) {
            alert("Unfortunately, all batches are either completed or currently being rated by other workers. Please refresh the webpage in a few hours to see if there are still batches that are available to be rated (This can happen if some workers decide to abandon the task).");
          } else if (!already_completed) {

            var intents_arr = []
            var sent_count_arr = []
            var filled_sent_count_arr = []

            //for (var i = 0; i < jsonData.data[part].dialogs.length; i++) {
            for (var i = 0; i < this.state.data[part].dialogs.length; i++) {
              //var dialog_arr = []
              var count = 0
              //for (var j = 0; j < jsonData.data[part].dialogs[i].turns.length; j++) {

              /* if also rate ground-truth advise with permission */
              /*dialog_arr.push(null);
              dialog_context_arr.push(null)
              count += 1*/

              /*for (var j = 0; j < this.state.data[part].dialogs[i].predictions.length; j++) {
                dialog_arr.push(null);
                count += 1
              }*/
              
              count += 1
              intents_arr.push(null);

              sent_count_arr.push(count);
              filled_sent_count_arr.push(0);
            }

            console.log("Intents arr:");
            console.log(intents_arr);

            var new_postion = this.state.position + 1;

            fetch(`${window.location.origin}/emotionrecog/proceed`,{
            //fetch(`${window.location.origin}/proceed`,{
              method: 'POST',
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({
                "annotator_name": this.state.annotator_name,
                "part": part,
              })
            }).then(res => res.json())
            .then(response => 
              {
                if (response.saved === true) {
                  this.setState({
                    intents_arr: intents_arr,
                    sent_count_arr: sent_count_arr,
                    filled_sent_count_arr: filled_sent_count_arr,
                    task_proceeded: true,
                    part_no: part,
                    position: new_postion,
                    start_time: Date.now(),
                  });
                  this.check();
                  console.log("Task proceeded anyways: ", this.state.task_proceeded);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  alert("An error occured!");
                }
              }
            );

          }

        });

    }
  }


  /*handleProceedAnyway(e) {
    console.log("handleProceed");
    if (e != null) {

        console.log(e); // {value: 'Closed Question', label: 'Closed Question', className: 'cq'}
        console.log(e.currentTarget);
        console.log(e.currentTarget.id);

        var arr = e.currentTarget.id.split("-");
        var part = parseInt(arr[1]);
        
        var intents_arr = []
        var context_arr = []
        var sent_count_arr = []
        var filled_sent_count_arr = []

        //for (var i = 0; i < jsonData.data[part].dialogs.length; i++) {
        for (var i = 0; i < this.state.data[part].dialogs.length; i++) {
          var dialog_arr = []
          var dialog_context_arr = []
          var count = 0

          //if also rate ground-truth advise with permission
          //dialog_arr.push(null);
          //dialog_context_arr.push(null);
          //count += 1

          //for (var j = 0; j < jsonData.data[part].dialogs[i].turns.length; j++) {
          for (var j = 0; j < this.state.data[part].dialogs[i].predictions.length; j++) {
            dialog_arr.push(null);
            count += 1
          }
          intents_arr.push(dialog_arr);
          context_arr.push(dialog_context_arr);
          sent_count_arr.push(count*2);
          filled_sent_count_arr.push(0);
        }

        console.log("Intents arr:");
        console.log(intents_arr);
        console.log("Context arr:");
        console.log(context_arr);

        var new_postion = this.state.position + 1;

        this.setState({
          intents_arr: intents_arr,
          context_arr: context_arr,
          sent_count_arr: sent_count_arr,
          filled_sent_count_arr: filled_sent_count_arr,
          task_proceeded: true,
          part_no: part,
          position: new_postion,
        });
        this.check();
        console.log("Task proceeded anyways: ", this.state.task_proceeded);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }*/

  start_timer(e) {
    this.setState({start_time: Date.now(), position:(this.state.position+1)});
  }

  submit(e){
    
    var end_time = Date.now();
    var elapsed = (end_time - this.state.start_time)/60000 // time in minutes (milliseconds ==> minutes)

    //console.log("Elapsed time: " + elapsed);

    var answers_arr = [];
    for (var i = 0; i < this.state.data[this.state.part_no].dialogs.length; i++) {
      var obj = {
        "dialog_id": this.state.data[this.state.part_no].dialogs[i].id,
        "turn_count": this.state.data[this.state.part_no].dialogs[i].turn_count,
        "answers_intents": this.state.intents_arr[i]
      };
      answers_arr.push(obj);
    }

    
    console.log("saving...");
    console.log({
        "part": this.state.part_no,
        "answers": answers_arr,
        "empathy_survey": this.state.toronto_empathy_arr,
        "time_elapsed": elapsed,
      })


    fetch(`${window.location.origin}/emotionrecog/save`,{
    //fetch(`${window.location.origin}/save`,{
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "annotator_name": this.state.annotator_name,
        "part": this.state.part_no,
        "answers": answers_arr,
        "empathy_survey": this.state.toronto_empathy_arr,
        "time_elapsed": elapsed,
      })
    }).then(res => res.json())
    .then(response => 
      {
        if (response.saved === true) {
          //var response = window.alert("Your answers are successfully saved. Click 'OK' to go back to the Dashboard");
          this.setState({
            showSuccessModal: true,
          });
          /*this.check();
          this.setState({
            position: 2, // dashboard index
            task_proceeded: false,
            question_no: 0,
          });*/
        } else {
          this.setState({
            showErrorModal: true,
          });
          //var response = window.alert("There has been an error saving your results please try again. If this issue continues, please contact the administrator.");
          /*this.setState({
            position: this.state.position + 2
          })*/
        }
      }
    );

    
  }

  getTotalCompletions() {
    var completed_cases = 0;
    for (var i=0; i < this.state.data[this.state.part_no].dialogs.length; i++) {
      if (this.state.filled_sent_count_arr[i] === this.state.sent_count_arr[i]) {
        completed_cases += 1
      } else {
        break
      }
    }
    return completed_cases;
  }

  //<Select onChange={this.handleDropdownChange.bind(this)} id={"midrop"+i+"-"+j+"-"+k} isClearable={true} options={MI_intents} isSearchable={true}/>

  handleNextPage(e){
    var current_path = window.location.href;
    console.log(current_path);
    var prefix = current_path.substring(0, current_path.length - 2);
    console.log(prefix)
    var next_url = prefix+"/"+(this.state.part_no+1); //http://localhost:5436//10
    console.log(next_url);
    window.location.href = next_url;
    //window.open(next_url);
    //this opens in a new tab (believe that is what the owner of the question wanted if not you can do window.location.href = "/insert/your/path/here". 
  }

  handleDashboard(e){
    this.setState({
      task_proceeded: false,
      position: 2,
    })
    /*window.location.reload();*/
  }

  validate_tutorial(e) {
    this.setState({tutorial_reveal: true});
  }

  handleTextChange(e) {
      console.log("Handle text change");
      if (e != null) {
        var annotator_name = e.currentTarget.value;
        this.setState({
          annotator_name: annotator_name,
        })
      }
  }

  /*checkUser(e) {

    //fetch(`${window.location.origin}/emotionrecog/users`,{
    fetch(`${window.location.origin}/users`,{
      method: 'GET',
      headers : { 
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()).then(res => {
      console.log(res);
      var permit = false;
      var annotator_realname = '';
      var max_hits_per_worker = -1

      for (var k = 0; k < res.users.length; k++) {
        if(res.users[k].WorkerID === this.state.annotator_name) {
          permit = true;
          annotator_realname = res.users[k].Name
          max_hits_per_worker = res.users[k].Hits
          break;
        }
      }

      if (permit === true) {
        this.setState({
          position: this.state.position + 1,
        })
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("The WorkerID you entered is incorrect. Please enter the correct WorkerID!");
      }

    });

    
  }*/

  /*handleTaskDropdownChange(e) {
      console.log("Handle task dropdown change");

      if (e != null) {
        console.log(e); // {value: 'Closed Question', label: 'Closed Question', className: 'cq'}
        console.log(e.id);  // cq-i-j-k
        console.log(e.value); // Closed Question

        var arr = e.id.split("-");
        var i = parseInt(arr[1]);
        var j = parseInt(arr[2]);
        var k = parseInt(arr[3]);

        //var ele = document.getElementById("hgroup"+i+"-"+j+"-"+k)
        //console.log(ele)
        //ele.style.backgroundColor = e.color;

        var i_arr = this.state.task_intents_arr;

        i_arr[i][j][k] = e;

        console.log(i_arr);
        this.setState({
          task_intents_arr: i_arr,
        })
      }
  }

  handleDropdownChange(e) {
      console.log("Handle dropdown change");

      if (e != null) {
        console.log(e); // {value: 'Closed Question', label: 'Closed Question', className: 'cq'}
        console.log(this.state.question_no); // i=0
        console.log(e.id);  // cq-i-j-k
        console.log(e.value); // Closed Question

        var arr = e.id.split("-");
        var i = parseInt(arr[1]);
        var j = parseInt(arr[2]);
        var k = parseInt(arr[3]);

        //var ele = document.getElementById("hgroup"+i+"-"+j+"-"+k)
        //console.log(ele)
        //ele.style.backgroundColor = e.color;

        var i_arr = this.state.intents_arr;
        var count_arr = this.state.filled_sent_count_arr;

        if (i_arr[i][j][k] == null) {
          count_arr[i] += 1;
        } 

        i_arr[i][j][k] = e;

        console.log(i_arr);
        console.log(count_arr);
        console.log(this.state.sent_count_arr);
        this.setState({
          intents_arr: i_arr,
          filled_sent_count_arr: count_arr
        })
      }

      
  }*/

  handleQuestionState(question_index) {
    console.log("Question index: ", question_index);
    this.setState({
      question_no: question_index,
    })
  }

  handleTaskCheckChange(e) {

    console.log("handleTaskCheckChange");

    if (e != null) {

      console.log(e);
      console.log(e.target.id);
      console.log(e.target.value);

      var arr = e.target.id.split("-");
      var i = parseInt(arr[1]);
      var j = parseInt(arr[2]);

      var i_arr = this.state.task_check_arr;

      i_arr[i][j] = 1;

      console.log(i_arr);

      this.setState({
        task_check_arr: i_arr,
      })

    }

  }

  handleTaskRadioChange(e) {

    console.log("handleTaskRadioChange");

    if (e != null) {

      console.log(e);
      console.log(e.target.id);
      console.log(e.target.value);

      var arr = e.target.id.split("-");
      var i = parseInt(arr[1]);

      var i_arr = this.state.toronto_empathy_arr;
      var count = this.state.filled_toronto_empathy_count;

      if (i_arr[i] == null) {
        count += 1;
      } 

      i_arr[i] = e.target.value;

      console.log(i_arr);
      console.log(count);

      var survey_completed = false;
      if (count == toronto_empathy_questionnaire.length) {
        survey_completed = true;
      }

      this.setState({
        toronto_empathy_arr: i_arr,
        filled_toronto_empathy_count: count,
        survey_completed: survey_completed
      })

    }

  }

  handleRadioChange(e) {

    console.log("handleRadioChange");

    if (e != null) {

      console.log(e);
      console.log(e.target.id);
      console.log(e.target.value);

      var arr = e.target.id.split("-");
      var i = parseInt(arr[1]);

      //console.log(this.state);

      var i_arr = this.state.intents_arr;
      var count_arr = this.state.filled_sent_count_arr;

      if (i_arr[i] == null) {
        count_arr[i] += 1;
      } 

      i_arr[i] = e.target.value;

      console.log(i_arr);
      console.log(count_arr);
      console.log(this.state.sent_count_arr);
      
      this.setState({
        intents_arr: i_arr,
        filled_sent_count_arr: count_arr
      })

    }

  }

  /*handleTaskContextRadioChange(e) {

    console.log("handleTaskContextRadioChange");

    if (e != null) {

      console.log(e);
      console.log(e.target.id);
      console.log(e.target.value);

      var arr = e.target.id.split("-");
      var i = parseInt(arr[1]);
      var j = parseInt(arr[2]);

      var i_arr = this.state.task_context_arr;

      i_arr[i][j] = e.target.value;

      console.log(i_arr);

      this.setState({
        task_context_arr: i_arr,
      })

    }

  }*/

  /*handleContextRadioChange(e) {

    console.log("handleContextRadioChange");

    if (e != null) {

      console.log(e);
      console.log(e.target.id);
      console.log(e.target.value);

      var arr = e.target.id.split("-");
      var i = parseInt(arr[1]);
      var j = parseInt(arr[2]);

      console.log(this.state);

      var i_arr = this.state.context_arr;
      var count_arr = this.state.filled_sent_count_arr;

      if (i_arr[i][j] == null) {
        count_arr[i] += 1;
      } 

      i_arr[i][j] = e.target.value;

      console.log(i_arr);
      console.log(count_arr);
      console.log(this.state.sent_count_arr);
      this.setState({
        context_arr: i_arr,
        filled_sent_count_arr: count_arr
      })

    }

  }*/

  render() {


    const handleSubmitModalClose = () => {
      this.setState({showSubmitModal: false});
      this.submit();
    }
    const handleSuccessModalClose = () => {
      /*this.check();
      this.setState({
        position: 2, // dashboard index
        task_proceeded: false,
        question_no: 0,
        showSuccessModal: false,
      });*/
      window.location.href = redirect_url;
    }
    const handleErrorModalClose = () => {
      this.setState({
        showErrorModal: false,
      });
    }

    if (this.state.position === -1) {
      return this.getContent();
    } else {

      var breadcrumbs_arr = []

      for (var i = 0; i < total_hits; i++) {
        breadcrumbs_arr.push(
          <Breadcrumb.Item style={{display: (this.state.survey_completed === true && this.state.task_proceeded === true && this.state.part_no === i) ? 'inline' : 'none'}} class="breadcrumb-item" active={this.state.position === 3 && this.state.part_no === i} onClick={() => this.setState({position: 3})}>Batch {i+1}</Breadcrumb.Item>
        );
      }

      return (
        <div>
          <div class="container">
            <div class="strip"></div>
            <div class="section-container">
              <div style={{}}>
                <Breadcrumb style={{'display': 'block', 'width': '100%', 'margin': '0 auto', 'font-size': '20px'}}>
                  <Breadcrumb.Item class="breadcrumb-item" active={this.state.position === 0} onClick={() => this.setState({ position: 0 })}>General Information</Breadcrumb.Item>
                  <Breadcrumb.Item class="breadcrumb-item" active={this.state.position === 1} onClick={() => this.setState({ position: 1 })}>Tutorial</Breadcrumb.Item>
                  <Breadcrumb.Item class="breadcrumb-item" active={this.state.position === 2} onClick={() => this.setState({ position: 2 })}>Empathy Survey</Breadcrumb.Item>
                  {breadcrumbs_arr}
                </Breadcrumb>

              </div>
              <div>
                {this.getContent()}
              </div>
            </div>
          </div>

          <Modal show={this.state.showSubmitModal} onHide={handleSubmitModalClose} backdrop="static" dialogClassName="submit-modal" contentClassName="submit-modal-content">
            <Modal.Header className="submit-header">
              <Modal.Title>Submit answers</Modal.Title>
            </Modal.Header>
            <Modal.Body className="submit-body">Are you sure you want to submit your answers for this batch? You will not be able to modify your answers after submission.</Modal.Body>
            <Modal.Footer className="submit-footer">
              <Button className="googlebtn" variant="secondary" onClick={() => {this.setState({showSubmitModal:false})}}>
                Cancel
              </Button>
              <Button className="googlebtnsubmit" variant="primary" onClick={handleSubmitModalClose}>
                Yes, submit my answers
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.showSuccessModal} onHide={() => {this.setState({showSuccessModal: false})}} backdrop="static" dialogClassName="success-modal" contentClassName="success-modal-content">
            <Modal.Header className="success-header">
              <Modal.Title>Answers successfully saved!</Modal.Title>
            </Modal.Header>
            <Modal.Body className="success-body"><p>Your answers were successfully saved!</p>
            <p>Your survey completion code is: <b>{copy_code}</b></p>
            <p>You need to copy and paste the above code in Prolfic in order to get paid. So, please save the above code somewhere.</p>
            <p>Click the button below to get you back to Prolific.</p></Modal.Body>
            <Modal.Footer className="success-footer">
              <Button className="googlebtnsubmit" variant="primary" onClick={handleSuccessModalClose}>
                Go back to Prolific
              </Button>
            </Modal.Footer>
          </Modal>


          <Modal show={this.state.showErrorModal} onHide={() => {this.setState({showErrorModal: false})}} backdrop="static" dialogClassName="error-modal" contentClassName="error-modal-content">
            <Modal.Header className="error-header">
              <Modal.Title>Error occured!</Modal.Title>
            </Modal.Header>
            <Modal.Body className="error-body">An error occured while saving your answers. Please try again. If this issue persists, please contact the administrator.</Modal.Body>
            <Modal.Footer className="error-footer">
              <Button className="googlebtnsubmit" variant="primary" onClick={handleErrorModalClose}>
                Okay
              </Button>
            </Modal.Footer>
          </Modal>
        
        </div>
      )

    }

    
    
  } // end of render





  getContent() {

    if (this.state.position === -1) { // Enter worker id
      return (
        <div>
          <div class="container">
          <div class="strip"></div>
            <div class="section-container">
              <div class="root-container">
                <div id="end" className="section section-end">
                    <div id="description">
                      <p>To proceed to the task, please enter your Prolific ID.</p> 
                      <input type="text" value={this.state.annotator_name} onChange={this.handleTextChange.bind(this)} />
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-container">
            <button type="button" className='googlebtnsubmit' onClick={this.handleProceed.bind(this)} disabled={this.state.annotator_name == ""} className={(this.state.annotator_name == "") ? 'googlebtndisabled' : 'googlebtnsubmit'}>Next</button>
            <span class={(this.state.annotator_name == "" ? "validateinfo" : "d-none")}> You should enter your Prolific ID before you can proceed! </span>
          </div>
        </div>
      );
    }

    else if (this.state.position === 0) {

      var content = [];
      var buttons = [];

      content.push(
        <div>
          <p><b>Task description:</b></p>

          <div class="desc-div">
            <p>We are scientists from a leading engineering university in Europe. </p>        
            <p><b>In this study, we will present you with responses given to 10 emotional situations. We need to you rate how empathetic the responses are in terms of "Good", "Okay", or "Bad" compared to how you would have responded in the same situations.</b></p>          
            <p>In the next page, we will show you a quick tutorial describing the concept of empathy along with some examples. <b>Please make sure you read this tutorial before proceeding to the task.</b></p>
            <p>Before proceeding to the task, we will ask you to answer a survey that will measure your <b>empathy propensity</b> (An individual's tendency to empathize as a function of the situation.) since we believe an individual's empathy propensity can affect how they rate the responses. After completing this survey, you will be directed to the actual task where you need to rate the empathy of dialogue responses.</p>
          </div>

          <br></br>
          <p><b>Logistics:</b></p>
          
          <div class="desc-div">
            <p>We offer to pay <b>€{pay_per_batch}</b> for this task.</p>
            <p><b>Please make sure that you complete rating all the 10 responses and click on the "Submit" button at the end, which will show a code that you will have to copy and paste into Prolific in order to get paid.</b></p>
            <p><b>Please avoid refreshing the page until you complete the survey and rate all the 10 responses and submit your work.</b></p>
            <p>Thank you in advance for making your best effort and providing your valuable contribution to our research! </p>
          </div>

        </div>
      );

      buttons.push(
        <div className="btn-container" style={{'width': '100%', 'text-align': 'right'}}>
          <button style={{'margin-right':'0px'}} id="start" type="button" className="googlebtnsubmit" onClick={() => { this.setState({ position: (this.state.position+1)}); 
                                                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                                          }}>Next</button>
        </div>
      );

      return (
        <div>
          <div class="">
            <div class="strip"></div>
            <div class="section-container">
              <div class="root-container">
                <div id="welcome" className="section">
                    <div id="description">
                      {content}
                    </div>
                </div>
              </div>
            </div>
          </div>
          {buttons}
        </div>
      );// General information// General information
    }

    else if (this.state.position === 1) { // Practice task 

      var examples_div = []

      for (var m = 0; m < examples.length; m++) {
        examples_div.push(
          <div>
            <p><b><u>Example {(m+1)}</u></b></p>
            <div className="speaker-label">Speaker #1:</div>
            <div className="speaker-div"><b>{examples[m].speaker}</b></div>
            <div className="listener-label">Speaker #2:</div>
            <div className="listener-div"><b>{examples[m].listener}</b></div>
            <hr class="separator" style={{display: (m<(examples.length-1))?'block':'none'}}></hr>
          </div>
        );
      }

      return (
        <div>
          <div class="">
            <div class="section-container">
              <div class="root-container">
                <div id="end" className="section section-end">

                    <p><b>What is empathy?</b></p>

                    <div id="description" class="desc-div">
                      <p>Empathy is the ability to understand and share the feelings of another person. It is the ability to put yourself in someone else's shoes and see the world from their perspective. Empathy is a complex skill that involves cognitive, emotional, and compassionate components.</p>
                      <p><b>Cognitive empathy</b> is the ability to understand another person's thoughts, beliefs, and intentions. It is being able to see the world through their eyes and understand their point of view.</p>
                      <p><b>Affective empathy</b> is the ability to experience the emotions of another person. It is feeling what they are feeling, both positive and negative.</p>
                      <p><b>Compassionate empathy</b> is the ability to not only understand and share another person's feelings, but also to be moved to help if needed. It involves a deeper level of emotional engagement than cognitive empathy, prompting action to alleviate another's distress or suffering.</p>
                      <p>Empathy is important because it allows us to connect with others on a deeper level. It helps us to build trust, compassion, and intimacy. Empathy is also essential for effective communication and conflict resolution.</p>
                    </div>
                    <br></br>
                    <p><b>Examples of empathetic responses given by a speaker #2 to emotional experiences described by a speaker #1:</b></p>

                    <div id="description" class="desc-div">
                      {examples_div}
                    </div>

                </div>
              </div>
            </div>
          </div>
          <div className="btn-container" style={{'width': '100%', 'text-align': 'right'}}>
            <button type="button" className="googlebtn" onClick={() => {this.setState({ position: (this.state.position-1) }); window.scrollTo({ top: 0, behavior: 'smooth' });}}>Back</button>
            <button type="button" className='googlebtnsubmit' onClick={() => {this.setState({ position: (this.state.position+1) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Next</button>
          </div>
        </div>
      );
    }

    else if (this.state.position === 2) { //Empathy survey


      var questions = [];

      for (var i = 0; i < toronto_empathy_questionnaire.length ; i++) {
        questions.push(
          <div class="survey-div">
            <div class="empathy-questions">
              <div><p><b>{toronto_empathy_questionnaire[i].question}</b></p></div>
            </div>

            <table class="radiotable">
              <td>
                <div id={"taskRadioSelect"+i} className="radioSelect" onChange={this.handleTaskRadioChange.bind(this)}>
                  <table style={{'margin': '0 auto'}}>
                    <tr>
                      <td class="survey-radio"><input type="radio" class="rateradio" value="0" id={"taskradio-"+i+"-0"} name={"taskrating-"+i} checked={this.state.toronto_empathy_arr[i] === "0"}/></td>
                      <td class="survey-radio"><input type="radio" class="rateradio" value="1" id={"taskradio-"+i+"-1"} name={"taskrating-"+i} checked={this.state.toronto_empathy_arr[i] === "1"}/></td>
                      <td class="survey-radio"><input type="radio" class="rateradio" value="2" id={"taskradio-"+i+"-2"} name={"taskrating-"+i} checked={this.state.toronto_empathy_arr[i] === "2"}/></td>
                      <td class="survey-radio"><input type="radio" class="rateradio" value="3" id={"taskradio-"+i+"-3"} name={"taskrating-"+i} checked={this.state.toronto_empathy_arr[i] === "3"}/></td>
                      <td class="survey-radio"><input type="radio" class="rateradio" value="4" id={"taskradio-"+i+"-4"} name={"taskrating-"+i} checked={this.state.toronto_empathy_arr[i] === "4"}/></td>
                    </tr>
                    <tr>
                      <td class="survey-radio-label">Never</td>
                      <td class="survey-radio-label">Rarely</td>
                      <td class="survey-radio-label">Sometimes</td>
                      <td class="survey-radio-label">Often</td>
                      <td class="survey-radio-label">Always</td>
                    </tr>
                  </table>
                </div>
              </td>
            </table>

          </div>
        );
      }

      return (
        <div>
          <div class="">
            <div class="section-container">
              <div class="root-container">
                <div id="end" className="section section-end">

                    <p><b>Below is a list of statements. Please read each statement carefully and rate how frequently you feel or act in the manner described. There are no right or wrong answers or trick questions. Please answer each question as honestly as you can.</b></p>
                    <p><b>Note: You need to first complete this survey to be able to procced to the actual task!</b></p>
                    <div>
                      {questions}
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-container" style={{'width': '100%', 'text-align': 'right'}}>
            <span style={{'margin-right': '10px'}} class={(!this.state.survey_completed) ? "validateinfo" : "d-none"}> You should answer all questions in the survey to procced! </span>
            <button type="button" className="googlebtn" onClick={() => {this.setState({ position: (this.state.position-1) }); window.scrollTo({ top: 0, behavior: 'smooth' });}}>Back</button>
            <button type="button" className={(!this.state.survey_completed) ? 'googlebtndisabled' : 'googlebtnsubmit'} disabled={!this.state.survey_completed} onClick={() => {this.setState({ position: (this.state.position+1) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Proceed to task</button>
          </div>
        </div>
      );

    }

    else if (this.state.position === 3) { // Real task

      var question_breadcrumbs_arr = [];

      for (var m = 0; m < this.state.data[this.state.part_no].dialogs.length; m++) {
        question_breadcrumbs_arr.push(
          <Breadcrumb.Item style={{display: ( (m > 0 && this.state.filled_sent_count_arr[m-1] === this.state.sent_count_arr[m-1]) || m === this.state.question_no || this.state.filled_sent_count_arr[m] === this.state.sent_count_arr[m]) ? 'inline' : 'none'}} class="breadcrumb-item" active={m === this.state.question_no} onClick={this.handleQuestionState.bind(this,m)}>{m+1}</Breadcrumb.Item>
        );
      }

      return (
        <div>
          <div class="">
            <div class="section-container">
              <div class="root-container">
                  <div id="questions" className="section question-section">
                      <div className="dialog-div">
                        <p><b>Below is a dialogue between two speakers, speaker #1 and speaker #2.</b></p>
                        <p><b>Rate how empathetic is the response given by the speaker #2 to the emotional situation described by the speaker #1, compared to how you would have responded in the same situation.</b></p>                        
                        <p><b>For better understanding, we also present the emotion of speaker #1 and the description of the situation that speaker #1 has encountered.</b></p>
                        <div style={{'text-align':'left', 'color':'#43a047'}}><b>{this.getTotalCompletions()} out of {this.state.data[this.state.part_no].dialogs.length} dialogues completed!</b></div>
                        <div style={{}}>
                          <Breadcrumb style={{'display': 'block', 'width': '100%', 'margin': '0 auto'}} bsPrefix='question-breadcrumb'>
                            {question_breadcrumbs_arr}
                          </Breadcrumb>
                        </div>
                        <div style={{'margin-top':'-15px'}}>
                          {this.getQuestionContent()}
                        </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          <div className="btn-container">
            {buttons}
          </div>

        </div>

      );
      

    }

    else if (this.state.position === 4) {

      var last_btn = []
      
      last_btn.push(
        <div>
          <button type="button" className="googlebtnsubmit" onClick={this.handleDashboard.bind(this)}>Go to dashboard</button>
        </div>
      );
      
      return (
        <div>
          <div class="container">
            <div class="strip"></div>
            <div class="section-container">
              <div class="header-container">Rate Rephrased Sentences</div>
            </div>
          </div>
          <div class="container">
            <div class="strip-2">Thank you!</div>
            <div class="section-container">
              <div class="root-container">
                <div id="end" className="section section-end">
                    <div id="description">
                      <p>Your answers are successfully recorded.</p> 
                      <p>To work on another available batch of dialogues, please click on the button below.</p> 
                      <p>If you have already finished annotating {this.state.max_hits_per_worker} batches of dialogues, please do not annotate more.</p> 
                      {last_btn}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );// saved successfully
    }

    else if (this.state.position === 5) {
      return (
        <div>
          <div class="container">
            <div class="strip"></div>
            <div class="section-container">
              <div class="header-container">Rate Rephrased Sentences</div>
            </div>
          </div>
          <div class="container">
            <div class="strip-2">SERVER ERROR!</div>
            <div class="section-container">
              <div class="root-container">
                <div id="end" className="section section-end">
                    <div id="description">
                      <p>Your answers were not saved due to an error in the server. Please contact the client.</p> 
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );// server error answers not saved
    }

    else if (this.state.position === 6) {
      return (
        <div>
          <div class="container">
            <div class="strip"></div>
            <div class="section-container">
              <div class="header-container">Rate Rephrased Sentences</div>
            </div>
          </div>
          <div class="container">
            <div class="strip-2">REQUEST ERROR!</div>
            <div class="section-container">
              <div class="root-container">
                <div id="end" className="section section-end">
                    <div id="description">
                      <p>Yout HIT was not submitted to MTurk. Please contact the administrator.</p> 
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );// mturk request error
    }

  } // end of getContent


  getQuestionContent() {

    console.log("Question no: " + this.state.question_no);

    var responses = []
    var last_msg = []
    var validate_msg = []
    var buttons = []
    
    var options = []
    var list_items = []
    var start_index = 0

    if (this.state.question_no === this.state.data[this.state.part_no].dialogs.length - 1) {
      last_msg.push(
        <div class="last-msg">You have come to the end of the task. Please click the submit button to record your answers.</div>   
      );
    }

    buttons.push(<span style={{'margin-right': '10px'}} class={(this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no] ? "validateinfo" : "d-none")}> You should rate the response before proceeding! </span>);

    if (this.state.question_no === 0) {
      //buttons.push(<button type="button" className="btn btn-light back-btn" onClick={() => this.setState({ position: 1 })}>Back to tutorial</button>)
      
      //buttons.push(<button type="button" className="googlebtn" onClick={() => this.setState({ position: (this.state.position-1) })}>Back</button>)
      
      //buttons.push(<button type="button" className="googlebtn" data-toggle="modal" data-target={"#myModal"}>Full Tutorial</button>)
      //buttons.push(<button type="button" className={((this.state.items[i]["good"].length + this.state.items[i]["okay"].length + this.state.items[i]["bad"].length) !== this.state.data[this.state.part_no].dialogs[i].responses.length ) ? 'googlebtndisabled' : 'googlebtnsubmit'} onClick={() => this.setState({ question_no: (this.state.question_no+1) })} disabled={((this.state.items[i]["good"].length + this.state.items[i]["okay"].length + this.state.items[i]["bad"].length) !== this.state.data[this.state.part_no].dialogs[i].responses.length)}>Next</button>)
      //buttons.push(<button type="button" className="googlebtn" data-toggle="modal" data-target={"#myModal"}>Full Tutorial</button>)
      buttons.push(<button type="button" className='googlebtnsubmit' onClick={() => {this.setState({ question_no: (this.state.question_no+1) }); window.scrollTo({ top: 0, behavior: 'smooth' });}} disabled={this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no]} className={(this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no]) ? 'googlebtndisabled' : 'googlebtnsubmit'}>Next</button>)

    } else if (this.state.question_no === (this.state.data[this.state.part_no].dialogs.length-1)) {
      
      buttons.push(<button type="button" className="googlebtn" onClick={() => {this.setState({ question_no: (this.state.question_no-1) }); window.scrollTo({ top: 0, behavior: 'smooth' });}}>Back</button>)
      //buttons.push(<button type="button" className="googlebtn" data-toggle="modal" data-target={"#myModal"}>Full Tutorial</button>)
      //buttons.push(<button type="button" className="googlebtn" data-toggle="modal" data-target={"#myModal"}>FUll Tutorial</button>)

      var input_arr = []

      input_arr.push(
          <input type="hidden" id="part_no" name="part_no" value={""+this.state.part_no}/>
      );

      input_arr.push(
          <input type="hidden" id="elapsed_time" name="elapsed_time" value={""+((Date.now()-this.state.start_time)/60000)}/>
      );

      for (var l = 0; l < this.state.data[this.state.part_no].dialogs.length; l++) {
        input_arr.push(
          <input type="hidden" id={"dialogID_"+l} name={"dialogID_"+l} value={""+this.state.data[this.state.part_no].dialogs[l].id}/>
        );
        input_arr.push(
          <input type="hidden" id={"answer_"+l} name={"answer_"+l} value={""+JSON.stringify(this.state.intents_arr[l])}/>
        );
      }

      for (var l = 0; l < this.state.toronto_empathy_arr.length; l++) {
        input_arr.push(
          <input type="hidden" id={"empathysurvey_"+l} name={"empathysurvey_"+l} value={""+JSON.stringify(this.state.toronto_empathy_arr[l])}/>
        );
      }

      //console.log(input_arr);

      if (this.state.host == null || this.state.host === null || this.state.host === void(0) || String(this.state.host) == "undefined" || String(this.state.host) === "undefined") {
        console.log("external submit link not hit")
        buttons.push(
          <div className="submitForm" display="inline">
            <input type="hidden" id="assignmentId" name="assignmentId" value={""+this.state.assignmentId} />
            <div>
              {input_arr}
            </div>
            <input type="submit" value="Submit my answers" className={(this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no]) ? 'googlebtndisabled' : 'googlebtnsubmit'} onClick={() => {this.setState({showSubmitModal: true})}} disabled={this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no]} />
          </div>
        );
      } else {
        console.log("external submit link hit")
        buttons.push(
          <form id="endForm" action={""+this.state.host} method="POST" className="submitForm" display="inline">
            <input type="hidden" id="assignmentId" name="assignmentId" value={""+this.state.assignmentId} />
            <div>
              {input_arr}
            </div>
            <input type="submit" value="Submit my answers" className={(this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no]) ? 'googlebtndisabled' : 'googlebtnsubmit'} onClick={() => {this.setState({showSubmitModal: true})}} disabled={this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no]} />
          </form>
        );
      }

    } else {
      buttons.push(<button type="button" className="googlebtn" onClick={() => {this.setState({ question_no: (this.state.question_no-1) }); window.scrollTo({ top: 0, behavior: 'smooth' });}}>Back</button>)
      //buttons.push(<button type="button" className="googlebtn" data-toggle="modal" data-target={"#myModal"}>Full Tutorial</button>)
      //buttons.push(<button type="button" className={((this.state.items[i]["good"].length + this.state.items[i]["okay"].length + this.state.items[i]["bad"].length) !== this.state.data[this.state.part_no].dialogs[i].responses.length || (this.state.data[this.state.part_no].dialogs[i].contain_gold_turn && this.state.gold_reveal[i] === false)) ? 'googlebtndisabled' : 'googlebtnsubmit'} onClick={() => this.setState({ question_no: (this.state.question_no+1) })} disabled={((this.state.items[i]["good"].length + this.state.items[i]["okay"].length + this.state.items[i]["bad"].length) !== this.state.data[this.state.part_no].dialogs[i].responses.length || (this.state.data[this.state.part_no].dialogs[i].contain_gold_turn && this.state.gold_reveal[i] === false))}>Next</button>)   
      //buttons.push(<button type="button" className='googlebtnsubmit' onClick={() => this.setState({ question_no: (this.state.question_no+1) })}>Next</button>)           
      //buttons.push(<button type="button" className="googlebtn" data-toggle="modal" data-target={"#myModal"}>Full Tutorial</button>)
      buttons.push(<button type="button" className='googlebtnsubmit' onClick={() => {
                                                                        this.setState({ question_no: (this.state.question_no+1) }); 
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                      }} disabled={this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no]} className={(this.state.filled_sent_count_arr[this.state.question_no] !== this.state.sent_count_arr[this.state.question_no]) ? 'googlebtndisabled' : 'googlebtnsubmit'}>Next</button>)
    
    }
    

    return (
      <div>
        <div>
          <div id={"form-group-"+this.state.data[this.state.part_no].dialogs[this.state.question_no].id} className="form-group">
            <div id="questions" className="section question-section">
                <div className="dialog-div">
                  <div>
                    <div className="emotion"><b>Emotion of the speaker:</b> <span className="emotion-label" style={{'background-color': ""+ED_color[this.state.data[this.state.part_no].dialogs[this.state.question_no].emotion]}}>{this.state.data[this.state.part_no].dialogs[this.state.question_no].emotion.charAt(0).toUpperCase()+this.state.data[this.state.part_no].dialogs[this.state.question_no].emotion.slice(1)}</span></div>
                    <div className="situation-div"><b>Situation:</b> {this.state.data[this.state.part_no].dialogs[this.state.question_no].situation}</div>
                  </div>
                  <hr class="separator"></hr>
                  <p><b>The dialogue:</b></p>
                  <div className="speaker-label">Speaker #1:</div>
                  <div className="speaker-div"><b>{this.state.data[this.state.part_no].dialogs[this.state.question_no].turns[0].text}</b></div>
                  <div className="listener-label">Speaker #2:</div>
                  <div className="listener-div"><b>{this.state.data[this.state.part_no].dialogs[this.state.question_no].turns[1].text}</b></div>
                  <p><b>The task:</b></p>
                  <div id={"radioSelect"+this.state.question_no} className="radio-div" onChange={this.handleRadioChange.bind(this)}>
                    <p><b>How empathetic is the speaker #2's response, compared to how you would have responded for the same situation?</b></p>
                    <table style={{'margin-left': '10px'}}>
                      
                      <tr>
                        <td><input type="radio" class="rateradio" value="2" id={"radio-"+this.state.question_no+"-2"} name={"rating-"+this.state.question_no} checked={this.state.intents_arr[this.state.question_no] === "2"}/></td>
                        <td>Good</td>
                      </tr>
                      <tr>
                        <td><input type="radio" class="rateradio" value="1" id={"radio-"+this.state.question_no+"-1"} name={"rating-"+this.state.question_no} checked={this.state.intents_arr[this.state.question_no] === "1"}/></td>
                        <td>Okay</td>
                      </tr>
                      <tr>
                        <td><input type="radio" class="rateradio" value="0" id={"radio-"+this.state.question_no+"-0"} name={"rating-"+this.state.question_no} checked={this.state.intents_arr[this.state.question_no] === "0"}/></td>
                        <td>Bad</td>
                      </tr>
                      
                    </table>
                  </div>

                  </div>
                </div>
                {last_msg}  
            </div>
          </div>

        <div className="btn-container" style={{'width': '100%', 'text-align': 'right'}}>
          {buttons}
        </div>

      </div>

    );

  }


}



export default App;
