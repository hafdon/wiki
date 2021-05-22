```js
changeEmail(email, {indexChange, toggleArchive, toggleRead, save, closeModal}) {

	if(toggleArchive) { email.archived = !email.archived }
	if(toggleRead) { email.read = !email.read }
	if(save) { 
		axios.put(`http://localhost:3000/emails/${email.id}\`, email) 
	}
	if(closeModal) { 
		this.openedEmail = null;
		return null; 
	}
	if(indexChange) {
		let index = this.emails.findIndex(e => e === email);
		this.openEmail(this.emails[index + indexChange])
	}
}
```
https://github.com/Code-Pop/build-gmail-clone-with-vue-3/blob/master/src/components/MailTable.vue#L61