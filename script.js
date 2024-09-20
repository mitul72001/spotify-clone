console.log("hello");

 let currfolder;
 let songs;
 function formatTime( seconds) {
  if(isNaN(seconds) || seconds<0){
      return "00:00"
  }
  // Ensure  seconds are non-negative integers
  const minutes =  Math.floor(seconds/60);
  const remainsec=Math.floor(seconds % 60);


  // Pad minutes and seconds with leading zeros if necessary
  let minutesStr = String(minutes).padStart(2,'0')
  let secondsStr = String(remainsec).padStart(2,'0')

  // Return the formatted time string
  return `${minutesStr}:${secondsStr}`;
}

async function getSongs(folder) {
  currfolder=folder
  let response = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let text = await response.text();
  // console.log(text);

  // Create a new div element and set its innerHTML
  let div = document.createElement("div");
  div.innerHTML = text;
  let lis = div.getElementsByTagName("li");
  // console.log(lis);
   songs = [];
  for (let index = 0; index < lis.length; index++) {
    const element = lis[index];
    const link = element.querySelector("a");
    if (link && link.href.endsWith(".mp3")) {
      songs.push(link.href.split(`/${folder}/`)[1]);
    }
  }
  // console.log(song.length)
  
  let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songUl.innerHTML=""
for (const song of songs) {
  songUl.innerHTML =songUl.innerHTML +`<li >
              <img class="invert" src="SVG/music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Mitul</div>
              </div>
             <div class="play">

                <span>Play</span>
                <img class="invert" src="SVG/pause.svg" alt="">
              </div>
            </li>`;
}

  //     //play the song
  //     var audio=new Audio(songs[0])
  //    // audio.play();

  //     audio.addEventListener("loadeddata",()=>{

  //         let duration=audio.duration
  //         console.log(audio.duration,)

  //     })
  //attach teh eventlisteener to song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (ele) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  return songs
}



const playMusic = (track,pause=false) => {
  // let audio=new Audio("/songs/"+track)
  currentSong.src = `/${currfolder}/` + track;
  if(!pause){
   currentSong.play()
   play.src = "SVG/play.svg";
  }
  document.querySelector(".songInfo").innerHTML=decodeURI(track)
  document.querySelector(".songtime").innerHTML="00:00/00:00"
};

let currentSong = new Audio();

async function displayAlbum(){
  let response = await fetch(`http://127.0.0.1:5500/songs/`);
  let text = await response.text();
   let div = document.createElement("div");
  div.innerHTML = text;
  // console.log(div)
  let cardContain=document.querySelector(".cardContain")
 let anchor= div.getElementsByTagName("a")
//  console.log(anchor)
 let array=Array.from(anchor)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    
  if(e.href.includes("/songs/")){
   let folder=e.href.split("/").slice(-1)[0]
// console.log(folder)
   //get meta data
   let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
  let text = await a.json();
  // console.log(text)
  cardContain.innerHTML=cardContain.innerHTML + `<div data-folder=${folder} class="card">
                    <div  class="circular-container play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill=#000>
                            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <h2>${text.title}</h2>
                    <p>${text.description}</p>
                </div>`
  }
 }
 //load the library
 Array.from(document.getElementsByClassName("card")).forEach(e=>{
  // console.log(e)
    e.addEventListener("click",async item=>{
       songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
       playMusic(songs[0])
    })
  })
 

}
async function main() {
   await getSongs("songs/ncs");
  // console.log(songs)
//    playMusic.play(songs[0],true)
playMusic(songs[0],true)

  //display the folder
   displayAlbum()

  //attach the event listener in bnt
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "SVG/play.svg";
    } else {
      currentSong.pause();
      play.src = "SVG/pause.svg";
    }
  });

  //listen for time update
  currentSong.addEventListener("timeupdate",()=>{
    // console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".songtime").innerHTML=`${
        formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)} `
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
  })

  //add aevenlistener
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percent+"%"
    currentSong.currentTime=(currentSong.duration)*percent/100
  })

  //add a event listener at hamburger
  document.querySelector(".ham").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
  })
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%"
  })

  previous.addEventListener("click",()=>{
    let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0){
 
      playMusic(songs[index-1])
     }
  })

  next.addEventListener("click",()=>{
    // console.log("next")
   let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  
   if((index+1)<songs.length){

     playMusic(songs[index+1])
    }
  })
  //add event to volume
//   document.querySelector(".range").getElementsByTag("input")[0].addEventListener("change",(e)=>{
//    currentSong.volume=parseInt(e.target.value)/100
// })

// add a event to mute
// document.querySelector(".volume>img").addEventListener("click",(e)=>{
//   if(e.target.src.includes(volume.svg)){
//     e.target.src=e.target.src.replace("volume.svg","volume-off.svg"
//     currentSong.volume=0;
// document.querySelector(".range").getElementsByTag("input")[0].value=0
//   }
//   else{
//     currentSong.volume=.1;
//     e.target.src=e.target.src.replace("volume-off.svg","volume.svg")
//   }

// })


}
main();
