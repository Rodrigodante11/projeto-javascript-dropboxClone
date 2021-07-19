class DropBoxController{

    constructor(){
        this.btnSendFileEl = document.querySelector('#btn-send-file'); // id do botao enviar arquivo
        this.inputFilesEl = document.querySelector('#files'); // abrir para procurar arquivo
        this.snackModalEl = document.querySelector('#react-snackbar-root');   
        this.uploadProgressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg') // barra de progresso do upload
        this.uploadnameFileEl = this.snackModalEl.querySelector('.filename') // nome do arquivo colocado pelo suario
        this.uploadTimeLeftEl = this.snackModalEl.querySelector('.timeleft') // tempo restante 
        

        this.initEvents();
       
    }

    initEvents(){

        this.btnSendFileEl.addEventListener('click', event =>{
            
            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener('change', event =>
        {
            
            this.uploadTask(event.target.files) // passar os arquivos escolhido pelo usuario

            this.modalShow();
            this.inputFilesEl.value = '';
            
        });

    }

    modalShow(show = true){
        this.snackModalEl.style.display = (show) ?  'block' : 'none';
    }

    uploadTask(files){
        let promises = [];

        [...files].forEach(file=>{

            promises.push(new Promise((resolve, reject)=>{

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload =  event => {

                    this.modalShow(false);
                    try{
                        resolve(JSON.parse(ajax.responseText))
                    }catch(e){
                        reject(e);
                    }
                };

                ajax.onerror =  event =>{
                    this.modalShow(false);
                    reject(event);
                }

                ajax.upload.onprogress=  event =>{ // para de progesso de upload


                    this.uploadProgress(event, file);
                    console.log(event)

                };

                let formData = new FormData();
                formData.append('input-file', file);

                this.startUploadTime =  Date.now(); // guardando o inciio do upload

                ajax.send(formData);  // enviando o upload

            }));

        });

        return Promise.all(promises); //pega todas essas promessas e executa e controla
    }
    uploadProgress(event,file){ // calculando a porcentagem de upload 

        let timespent =  Date.now() - this.startUploadTime;  // tempo gasto
        let loaded = event.loaded;
        let total = event.total;
 
        let porcent = parseInt((loaded/total) *100);
        let timeleft = ((100 - porcent) * timespent) / porcent;

        this.uploadProgressBarEl.style.width = `${porcent}%`

        this.uploadnameFileEl.innerHTML = file.name;
        this.uploadTimeLeftEl.innerHTML = this.formarTimeToHuman(timeleft);

        console.log(timespent, timeleft, porcent);


    }

    formarTimeToHuman(duration){
        let seconds = parseInt((duration / 1000) %60) ;
        let minuts = parseInt((duration / (1000* 60)) %60);
        let hours = parseInt((duration / (1000 * 60 * 60)) %24);

        if(hours > 0){
            return `${hours} horas, ${minuts} minutos e ${seconds} segundos `;
        }else if(minuts > 0){
            return `${minuts} minutos e ${seconds} segundos `;
        }
        else if(seconds > 0){
            return `${seconds} segundos `;
        }else{
            return '';
        }

    }

}