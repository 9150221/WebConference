window.onload = function() {
    // codigo para manipular o DOM
    const btnRegister = document.getElementById("btnRegister");
    btnRegister.addEventListener("click",function(){
        //abertura de janela modal
        swal({
            title: "Inscrição na WebConference",
            html: '<input id="txtName" class ="swal2-input" placeholder="name">' + 
                '<input id="txtEmail" class ="swal2-input" placeholder="e-mail">',
            showCancelButton: true,
            confirmButtonText: "Inscrever",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const name = document.getElementById('txtName').value;
                const email = document.getElementById('txtEmail').value;
                const url_base = "https://fcawebbok.herokuapp.com";
                return
                    fetch(`${url_base}/conferences/1/participants/${email}`,{
                        headers: { "Content-type": "application/x-www-form-urlenconded" },
                        method: "POST",
                        body: `nomeparticipant=${name}`
                    })
                    .then(response => {
                        if(!response.ok){
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        swal.showValidationError(`Pedido falhou $(error)`);
                    });
            },
            allowOutsideClick: () => !swal.isLoading()
        
        }).then(result => {
            if(result.value){
                if(!result.value.err_code){
                    swal({title:"Inscrição feita com sucesso!"})
                }else{
                    swal({title: `${result.value.err_message}`})
                }
            }    

        })
    });
    ( async () =>{
        const renderSpeakers = document.getElementById("renderSpeakers");
        let txtSpeakers = "";
        const response = await fetch(`${urlBase}/conferences/1/speakers`);
        const speakers = await response.json();

        for (const speaker of speakers) {
            txtSpeakers += `
            <div class="col-sm-4">
            <div class="team-member">
              <!--Oradornº1-->
              <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="${speaker.foto}" alt="">
              <h4>${speaker.nome}</h4>
              <p class="text-muted">${speaker.cargo}</p>
              <ul class="list-inline social-buttons">`
              if(speaker.twitter !== null){
                  txtSpeakers += `
                  <li class="list-inline-item">
                  <a href="${speaker.twitter}"><i class="fab fa-twitter"></i></a>
                </li>
                  `
              }
              if(speaker.facebook !== null){
                txtSpeakers += `
                <li class="list-inline-item">
                <a href="${speaker.facebook}"><i class="fab fa-facebook-f"></i></a>
              </li>
                `
            }
            if(speaker.linkedin !== null){
                txtSpeakers += `
                <li class="list-inline-item">
                <a href="${speaker.linkedin}"><i class="fab fa-linkedin-in"></i></a>
              </li>
                `
            }
            txtSpeakers += `
            </ul>
            </div>
            </div>` 
        }
        const btnView = document.getElementsByClassName("viewSpeaker");
        for(let i =0; i<btnView.length; i++){
            btnView[i].addEventListener("click", ()=>{
                for(const speaker of speakers){
                    if(speaker.idSpeaker == btnView[i].getAttribute("id")){
                        //janela modal
                        swal ({
                            title: speaker.nome,
                            text: speaker.bio,
                            imageUrl: speaker.foto,
                            imagewidth:400,
                            imageHeight:400,
                            imageAlt:'Foto do orador',
                            animation: false
                        })
                    }
                }
            })
        }
        renderSpeakers.innerHTML = txtSpeakers;
    }) ();
    ( async ()=>{
        const renderSponsors = document.getElementById("renderSponsors");
        let txtSponsors = "";
        const response = await fetch (`${urlBase}/conferences/1/sponsors`);
        const sponsors = await response.json();

        for(const sponsor of sponsors){
            txtSponsors += `
            <div class ="col-md-3 col-sm-6">
            <a href0"${sponsor.link}" target ="_blank">
            <img class="img-fluid d-block mx-auto">
            src=${sponsor.logo}"
            alt=${sponsor.name}">
            </a>
            </div>
            `
        }
        renderSponsors.innerHTML =txtSponsors;
    }) ();
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", async () =>{
        const name = document.getElementById("name").value;
        const email =document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const response = await fetch(`${urlBase}/contacts/emails`,{
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `email=${email}&name=${name}&subject=${message}`
        })
        const result = await response.json();
        if(result.value.success){
            swal('Envio de mensagem', result.value.message.pt, 'success')
        }else{
            //Exibir modal com o erro
        }
    });
    //Ponto no mapa a localizar (cidade do peorto)
    const porto = new  google.maps.LatLng(41.14961, -8.61099);
    const mapProp ={
        center:porto,
        zoom:12,
        scrollwheel:false,
        draggable: false,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    }
    const map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    //janela de informacao
    const infowindow = new google.maps.InfoWindow({
        content: "É aqui a WebConference!"
    })
    const marker = new google.maps.Marker({
        position:porto,
        map:map,
        title:"WebConference"
    })
    marker.addListener('click', function(){
        infowindow.open(map, marker);
    })
}