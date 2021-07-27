function createQuizOption(value,id,pos)
{
    var mainDiv = document.createElement('div');
    mainDiv.classList.add('option-wrapper');

    var label = document.createElement('label');
    var inputRadio = document.createElement('input');

    inputRadio.type = 'radio';
    inputRadio.required = true;
    inputRadio.name = 'q'+id;
    inputRadio.value = parseInt(pos) + 1;

    var para = document.createElement('p');
    para.innerHTML = value;
    
    label.appendChild(inputRadio);
    label.appendChild(para);

    mainDiv.appendChild(label);

    return mainDiv;
}


function createquizquestion(obj)
{
    var mainSection = document.createElement('section');
    mainSection.classList.add('quiz-item');

    var question = document.createElement('h3');
    question.innerHTML = 'Q'+obj.id + '. ' + obj.question;

    mainSection.appendChild(question);

    for(var i=0;i<obj.options.length;i++)
    {
        mainSection.appendChild(createQuizOption(obj.options[i], obj.id, i));
    }

    return mainSection;

}

function addSubmitButton() {
    // <section id="submit-section">
    //     <input id="btn-submit" type="submit" value="Submit" />
    // </section>

    var mainSection = document.createElement('section');
    var submitBtn = document.createElement('input');
    submitBtn.id = 'btn-submit';
    submitBtn.type = 'submit';
    submitBtn.value = 'Submit';

    mainSection.appendChild(submitBtn);

    return mainSection;
}

var quiz = document.getElementsByClassName('quiz')[0];

var httprequest = new XMLHttpRequest;

httprequest.open("GET", "http://5d76bf96515d1a0014085cf9.mockapi.io/quiz",true);

httprequest.onreadystatechange = function() {
    if (httprequest.readyState == 4) {
        if(httprequest.status == 200) {
            var obj = JSON.parse(httprequest.responseText);
            // var data = JSON.stringify(httprequest.responseText);
            localStorage.setItem(quiz,JSON.stringify(obj));
            for(var i=0;i<obj.length;i++)
            {
                quiz.append(createquizquestion(obj[i]));
            }
            quiz.append(addSubmitButton());
        }
    }
};
httprequest.send(null);

if(location.search != '')
{
    var quizArr = localStorage.getItem(quiz);

    quizArr = JSON.parse(quizArr);

    var solution = location.search.split('?');
    solution = solution[1].split('&');

    var correctCount = 0;

    for(var i=0; i<quizArr.length; i++)
    {
       console.log('i=>', i);
       console.log(solution[i].split('='));
       console.log('q'+quizArr[i].id);

       if(solution[i].split('=')[0] === ('q'+quizArr[i].id)) {
            if(parseInt(solution[i].split('=')[1]) === parseInt(quizArr[i].answer)) {
                correctCount += 1;
            }
        }
    }

    var quizmodal = document.getElementById('modal-wrapper');
    quizmodal.style.display = 'block';

    var quizresult = document.getElementById('result');
    quizresult.innerHTML = correctCount + '/' + quizArr.length;

    var backdrop = document.getElementById('backdrop');

    backdrop.addEventListener('click',function(){
        location.search = '';
        quizresult.style.display = 'none';
    });
}


