// on récupère les données utiles selon qu'on soit sur la page d'accueil ou sur une page produit

async function getData(url){
    //si on est sur une page produit on récupère son id et ses données
    if(getCurrentId()){
        const res = await fetch(`${url}/${getCurrentId()}`).catch(e=>console.error(e))
        const data = await res.json().catch(e=>console.error(e))
        return data
    //sinon c'est qu'on est sur la page d'accueil et on récupère toutes les données
    }else{
        const res = await fetch(url).catch(e=>console.error(e))
        const data = await res.json().catch(e=>console.error(e))
        return data
    }
}
// on récupère l'id du produit si on est sur une page produit, sinon rien
function getCurrentId(){
    const currentUrl = window.location.href
    const url = new URL(currentUrl)
    const id = url.searchParams.get("id")
    return id
}

function getCart(){
    return JSON.parse(localStorage.getItem("aCart")) || []
  }
  

export {getData, getCurrentId, getCart}