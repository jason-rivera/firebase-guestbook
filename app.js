const guestbook = document.querySelector('#dialogue');
const form = document.querySelector('#add-guestbook-form');

var messageID = 0;

function renderGuestbook(doc) {
    let li = document.createElement('li');
    let message = document.createElement('span');
    let author = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    author.textContent = doc.data().author + " says: ";    
    message.textContent = doc.data().message;
    author.className = "author";
    
    li.appendChild(author);
    li.appendChild(message);
    
    guestbook.appendChild(li);
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('guestbook').add({
        author: form.author.value,
        message: form.message.value,
        messageID: messageID
    });
    messageID++;
    form.message.value = '';
    console.log('Message posted!');
})

db.collection('guestbook').orderBy('messageID').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderGuestbook(change.doc);
        } else if (change.type == 'removed') {
            let li = guestbook.querySelector('[data-id' + change.doc.id + ']');
            guestbook.removeChild(li);
        }
    })
    console.log('Guestbook Data retrieved');
})