const form = document.querySelector('.form');
const allInFormData = document.querySelectorAll('.form');

// newElementA = document.createElement('a');
// newElementA.href = `mailto:${email}?subject=${subject}&body=${message}`;
// newElementA.click();

const parentElement = document.querySelectorAll('label');
const newElementErrorMessage = document.createElement('small');

newElementErrorMessage.style.color = "red";
newElementErrorMessage.style.display = "block";
newElementErrorMessage.style.fontFamily = "arial";
newElementErrorMessage.style.marginTop = "10px";
newElementErrorMessage.style.fontSize = "1rem";


const errorMessage = {
    name: document.createTextNode("*name is required or name must be text not a number."),
    email: document.createTextNode("*email is required."),
    phone: document.createTextNode("*phone is required or phone must be number not a text."),
    subject: document.createTextNode("*subject is required"),
    message: document.createTextNode("*message is required")
}

function cloneElementMessage(error, label, ref) {
    ref.preventDefault();
    const clone = newElementErrorMessage.cloneNode();
    clone.append(error);
    label.appendChild(clone);
    return clone;
}

newElementA = document.createElement('a');

form.addEventListener('submit', ref => {
    const [name, email, phone, subject, message] = allInFormData[0];
    const [nameLabel, emailLabel, phoneLable, subjectLabel, messageLabel] = parentElement;

    function cek() {
        if (name.value == '' || isNaN(name.value) == false) {
            cloneElementMessage(errorMessage.name, nameLabel, ref);
            return true;
        } else {
            ref.preventDefault();
            if (document.querySelector('#nameInput small')) {
                document.querySelector('#nameInput small').remove();
            }
        }
        if (email.value == '') {
            cloneElementMessage(errorMessage.email, emailLabel, ref);
            return true;
        } else {
            ref.preventDefault();
            if (document.querySelector('#emailInput small')) {
                document.querySelector('#emailInput small').remove();
            }
        }

        if (phone.value == '' || isNaN(phone.value) == true) {
            cloneElementMessage(errorMessage.phone, phoneLable, ref);
            return true;
        } else {
            ref.preventDefault();
            if (document.querySelector('#phoneInput small')) {
                document.querySelector('#phoneInput small').remove();
            }
        }

        if (subject.value == '') {
            cloneElementMessage(errorMessage.subject, subjectLabel, ref);
            return true;
        } else {
            ref.preventDefault();
            if (document.querySelector('#subjectInput small')) {
                document.querySelector('#subjectInput small').remove();
            }
        }
        if (message.value == '') {
            cloneElementMessage(errorMessage.message, messageLabel, ref);
            return true;
        } else {
            ref.preventDefault();
            if (document.querySelector('#messageInput small')) {
                document.querySelector('#messageInput small').remove();
            }
        }
    }
    if (cek() != true) {
        newElementA.href = `mailto:galihbatu098@gmail.com?subject=${subject.value}&body=Hello my name is ${name.value}, ${message.value}`;
        newElementA.click();
    }
});


// function showData() {
//     const allInFormData = document.querySelectorAll('.form');

//     const [name, email, phone, subject, message] = allInFormData[0];

//     newElementA = document.createElement('a');
//     newElementA.href = `mailto:${email.value}?subject=${subject.value}&body=${message.value}`;
//     newElementA.click();
// }