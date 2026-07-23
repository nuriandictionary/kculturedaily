// ===============================
// Google Sheet 설정
// ===============================

const CATEGORY = {

    kpop:{
        name:"🎵 K-POP",
        sheetId:"1EN_pSPiBeDSnV2uU5yFy8JsE8l_rggkPhpKsxoQ90nk",
        gid:"1217659133"
    },


    travel:{
        name:"✈️ K-Travel",
        sheetId:"1EN_pSPiBeDSnV2uU5yFy8JsE8l_rggkPhpKsxoQ90nk",
        gid:"688138741"
    },


    food:{
        name:"🍜 K-Food",
        sheetId:"1EN_pSPiBeDSnV2uU5yFy8JsE8l_rggkPhpKsxoQ90nk",
        gid:"1496006223"
    },


    beauty:{
        name:"💄 K-Beauty",
        sheetId:"1EN_pSPiBeDSnV2uU5yFy8JsE8l_rggkPhpKsxoQ90nk",
        gid:"1294508636"
    },


    fashion:{
        name:"👗 K-Fashion",
        sheetId:"1EN_pSPiBeDSnV2uU5yFy8JsE8l_rggkPhpKsxoQ90nk",
        gid:"1305408964"
    }

};



// ===============================
// 변수
// ===============================


let videos=[];

let index=0;

const batch=15;

let currentCategory="kpop";

const container=document.getElementById("container");

const loading=document.getElementById("loading");




// ===============================
// Google Sheet 데이터 로드
// ===============================


async function loadCategory(category){


    currentCategory=category;


    const info=CATEGORY[category];


    if(!info){

        return;

    }



    // URL 변경

    history.pushState(
        null,
        "",
        "#" + category
    );



    // 제목 변경

    document.getElementById(
        "category-title"
    ).innerHTML=info.name;



    // 메뉴 활성화

    document
    .querySelectorAll(".bottom-nav button")
    .forEach(btn=>{


        btn.classList.toggle(

            "active",

            btn.dataset.category===category

        );


    });



    container.innerHTML="";

    videos=[];

    index=0;



    loading.style.display="block";



    const url=
    `https://docs.google.com/spreadsheets/d/${info.sheetId}/gviz/tq?tqx=out:json&gid=${info.gid}`;



    try{


        const txt =
        await fetch(url)
        .then(r=>r.text());



        const json=JSON.parse(

            txt

            .replace("/*O_o*/","")

            .replace(
            "google.visualization.Query.setResponse(",
            ""
            )

            .slice(0,-2)

        );



        videos = json.table.rows
        .slice(1)
        .map(r=>({


            title:r.c[0]?.v ?? "",

            link:r.c[1]?.v ?? "",

            thumbnail:r.c[2]?.v ?? "",

            published:r.c[3]?.v ?? "",

            channel:r.c[4]?.v ?? ""


        }));



        // 최신 데이터를 위로

        videos.reverse();



        loading.style.display="none";



        render();



    }

    catch(e){

        console.error(e);

        loading.innerHTML="데이터 로딩 실패";

    }

}





// ===============================
// 영상 카드 생성
// ===============================


function render(){



    for(
        let i=0;
        i<batch && index<videos.length;
        i++,index++
    ){



        const v=videos[index];



        const card=
        document.createElement("div");


        card.className="card";



        const date =
        new Date(v.published)
        .toLocaleDateString("ko-KR");



        card.innerHTML=`

            <img class="thumb"
            src="${v.thumbnail}"
            loading="lazy">


            <div class="info">

                <div class="title">
                    ${v.title}
                </div>


                <div class="channel">
                    ${v.channel}
                </div>


                <div class="date">
                    ${date}
                </div>


            </div>

        `;



        card.onclick=()=>playVideo(card,v,date);



        container.appendChild(card);


    }



    if(index>=videos.length){

        loading.style.display="none";

    }


}



// ===============================
// 유튜브 재생
// ===============================


function playVideo(card,v,date){


    const id =
    new URL(v.link)
    .searchParams
    .get("v");



    card.innerHTML=`


    <iframe

    src="https://www.youtube.com/embed/${id}?autoplay=1"

    allow="autoplay"

    allowfullscreen>

    </iframe>



    <div class="info">


        <div class="title">

        ${v.title}

        </div>


        <div class="channel">

        ${v.channel}

        </div>


        <div class="date">

        ${date}

        </div>


    </div>


    `;


}



// ===============================
// 무한 스크롤
// ===============================


window.addEventListener(
"scroll",
()=>{


    if(
        window.innerHeight +
        window.scrollY >
        document.body.offsetHeight-500
    ){

        render();

    }


});





// ===============================
// 메뉴 클릭
// ===============================


document
.querySelectorAll(".bottom-nav button")
.forEach(btn=>{


    btn.onclick=()=>{


        loadCategory(
            btn.dataset.category
        );


        window.scrollTo(
            {
                top:0,
                behavior:"smooth"
            }
        );


    };


});




// ===============================
// 뒤로가기
// ===============================


window.addEventListener(
"popstate",
()=>{


    const hash =
    location.hash.replace("#","")
    || "kpop";


    loadCategory(hash);


});




// ===============================
// 최초 실행
// ===============================


const first =
location.hash.replace("#","")
|| "kpop";


loadCategory(first);


