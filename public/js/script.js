$(document).ready(function () {

    function isObject(e) {
        return typeof e === "object";
    }

    let form = $("[app-form]");

    form.on("submit", (e) => {
        e.preventDefault();
    });


    form.find("[app-input]").on("keyup", function (e) {

        if (e.keyCode == 13) {
            let value = $(this).val().trim();

            if (value !== "") {
                $("[app-form-container]").css("border", "none");
                if (!Number(value)) {
                    $.ajax({
                        url: "/word",
                        method: "POST",
                        dataType: "Json",
                        data: {
                            word: value
                        },
                        success: function (e) {
                            if (!e.error) {
                                insertQuery(e);
                                $("[app-input]").val("")
                            } else {
                                speak(e.text);
                            }
                        },
                        error: function (err, status) {
                            if (status == "error")
                                speak("Hey there, an error has just occured");
                        }
                    })
                } else {
                    alert("Number are not allowed")
                }
            } else {
                $("[app-form-container]").css("border", "1px solid red")
            }
        }
    });



    function appTemplate(p) {

        var meaning = p.meanings[0],
            i = 0,
            def = "",
            definitions = meaning.definitions[0],
            synonyms = definitions.synonyms.length > 0 ? `<li class="list--item p-2">${definitions.synonyms[0]}</li>` : "",
            antonyms = definitions.antonyms.length > 0 ? `<li class="list--item p-2">${definitions.antonyms[0]}</li>` : "",
            example = definitions.example !== "" ? definitions.example : " ";

        $("#app-audio").attr("src", `https:${p.phonetics[0].audio}`);



        if (p.meanings.length > 1) {
            for (; i < p.meanings.length; i++) {
                meaning = p.meanings[i];
            }
        }

        if (definitions.length > 1) {
            for (; i < meaning.definitions.length; i++) {
                def += `
                <p class=" mb-4 definition" app-definition>
                 ${ meaning.definitions[i].definition}
                 </p>`
            }
        } else {
            def += `<p class=" mb-4 definition" app-definition>
                    ${ meaning.definitions[0].definition}
                    </p>`
        }

        if (definitions.synonyms.length > 1) {
            synonyms = "";
            for (; i < definitions.synonyms.length; i++) {
                synonyms += `<li class="list--item p-2">${definitions.synonyms[i]}</li>`;
            }
        }

        if (definitions.antonyms.length > 1) {
            antonyms = "";
            for (; i < definitions.antonyms.length; i++) {
                antonyms += `<li class="list--item p-2">${definitions.antonyms[i]}</li>`;
            }
        }


        let html = `<div class="app-modals active mb-5" app-temp>

                    <div class="app-modal des">

                        <div class="mb-4">
                            <h3 class="word d-flex mb-0 align-items-center justify-content-between">
                                <span class="word-txt" app-word>${p.word}</span>
                                <button class="btn app-btn sm"><span app-speak class="bi bi-volume-up"></span></button>
                            </h3>
                            <p class="phonetic mb-lg-3 small">
                                <span app-phonetic>${p.phonetic !== undefined? p.phonetic : ""}</span>
                            </p>
                        </div>

                        <div class="partOfSpeech" app-speech>
                            <strong class="small mb-3">
                                <span class="caption fst-italic" app-partOfSpeech>${meaning.partOfSpeech}</span>
                              </strong>

                              ${def}
                           

                        </div>

                        <div class="app-origin mb-4">
                            <strong class="small mt-0 mb-2 pb-0 fst-italic text-white" app-origin>Origin :</strong>
                            <div class="des mb-4">
                              ${p.origin !== undefined? p.origin : "not available"}
                            </div>
                        </div>

                       <div class="app-example">
                            <p class="caption small fst-italic mb-1">Example</p>

                            <div app-example class="example">
                               ${definitions.example !== undefined? definitions.example : ""}
                            </div>

                        </div>

                    </div>`;

        if (synonyms !== "") {
            html += `<div class="app-modal" app-synonyms>
                        <h3 class="title">
                            <span class="word-txt small fst-italic">Synonyms</span>
                        </h3>

                        <ul class="list p-0 mt-4">
                            ${synonyms}
                        </ul>
                    </div>`
        }

        if (antonyms !== "") {
            html += `<div class="app-modal" app-antonyms>
                        <h3 class="title">
                            <span class="word-txt small fst-italic">Antonyms</span>
                        </h3>

                        <ul class="list p-0 mt-4">
                            ${antonyms}
                        </ul>
                    </div>`
        }

        html += '</div>';

        $("[app-body-list]").append(html);


    }



    function insertQuery(e) {

        //Clear the body
        $("[app-body-list]").html("");

        if (!isObject(e)) {
            throw new Error("Parameter type must be an object");
        }

        if (e.length > 1) {
            for (let index = 0; index < e.length; index++) {
                let r = {
                    meanings,
                    origin,
                    phonetic,
                    phonetics,
                    word
                } = e[index];

                appTemplate(r);
            }
        } else {

            var r = {
                meanings,
                origin,
                phonetic,
                phonetics,
                word
            } = e[0];

            appTemplate(r);
        }


    }

    $("[app-body-list]").on("click", "[app-temp]", function (e) {
        let val = $(e.target);

        if (val.is("[app-speak]")) {
            document.querySelector("#app-audio").play();
        }
    })

    function speak(e) {
        let speech = new SpeechSynthesisUtterance();
        speech.lang = "en-US";
        speech.text = e;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    }

    $("[app-button]").on("click", function () {
        speak($("[app-input]").val().trim() !== "" ? $("[app-input]").val().trim() : "You have an empty field. Type a word");
    })


});