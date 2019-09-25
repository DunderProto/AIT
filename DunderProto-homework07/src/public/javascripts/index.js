// TODO 
// Add client side JavaScript
//
function main() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/questions', true);
        xhr.addEventListener('load', function() {
            if (xhr.status >= 200 && xhr.status < 400) {
            const questions = JSON.parse(xhr.responseText);
            questions.forEach(function(obj) {
                document.body.appendChild(
                    document.createElement('div')
                ).innerHTML = "<h2>" + obj.question + "</h2>";

                obj.answers.forEach(function(ele) {
                    console.log(ele);
                    document.body.appendChild(
                        document.createElement('p')
                    ).innerHTML = ele;
                });
                let BTN =  document.createElement('button')
                document.body.appendChild(
                    BTN
                ).innerHTML = "Add an answer";
                BTN.addEventListener('click', function() {
                    document.getElementsByClassName("modal")[1].style.display = "inline";
                });
            });
            document.getElementById("btn-show-modal-question").addEventListener('click', function() {
                document.getElementsByClassName("modal")[0].style.display = "inline";
                document.getElementById("create-question")
            });
        }
    });

    xhr.send();
}

document.addEventListener("DOMContentLoaded", main);
