<script>
    import SoloRegister from "./SoloRegister.svelte";
    import TeamRegister from "./TeamRegister.svelte";
    import Questionnaire from "./Questionnaire.svelte";
    import * as jquery from 'jquery';
    import {onMount} from 'svelte';

    let teamType = 'solo';
    let showQuestionnaire = false;
    let team = {
        teamName: '',
        teamAcronym: '',
        teamSize: 2,
        teamMembers: [{
            firstName: '',
            lastName: '',
            email: '',
        }]
    };
    let teamLead = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        occupation: '',
        faculty: '',
        facultyPlace: '',
        yearOfStudy: '',
        dob: new Date(),
    };
    let questionnaire = {
        howDidYouHearAboutUs: '',
        didYouHearAboutSynechron: false,
        howDidYouHearAboutSynechron: '',
        didYouHearAboutDatum: false,
        howDidYouHearAboutDatum: '',
        objectOptions: '',
        tripleDoubleEquals: '',
        whatDoesSolidMean: '',
    };

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        teamLead.email = email;
    });


    function handleBack() {
        if (showQuestionnaire) {
            showQuestionnaire = !showQuestionnaire;
        } else {
            window.history.back();
        }
    }

    let showErrors = false;

    function validateInput() {
        let userValid = checkObj(teamLead);
        let teamValid = true;
        if (teamType === 'team') {
            teamValid = checkObj(team);
        }
        let questionValid = checkObj(questionnaire);
        showErrors = !(userValid && teamValid && questionValid);
    }

    function checkObj(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                if (key === 'occupation' && obj[key] !== '') {
                    if (obj[key] !== 'student') {
                        break;
                    }
                }
                if (key === 'howDidYouHearAboutSynechron' && !obj['didYouHearAboutSynechron']) {
                    continue;
                }
                if (key === 'howDidYouHearAboutDatum' && !obj['didYouHearAboutDatum']) {
                    continue;
                }
                if (obj[key] === '') {
                    return false;
                }
            }
        }
        return true;
    }

    async function handleSubmit() {
        validateInput();
        const req = {
            'team': JSON.stringify(team),
            'teamLead': JSON.stringify(teamLead),
            'questionnaire': JSON.stringify(questionnaire),
        }
        jquery.post("https://polar-bayou-29186.herokuapp.com/register",
            req,
            function (data, status, error) {
                console.log(status);
                alert("Uspesno ste se prijavili na takmicenje!");
                history.back();
            }).fail(function (err) {

            alert("Ups :( Izgleda da je doslo do greske sa tvojom prijavom! Pokusajte kasnije ili nas kontaktirajte putem " +
                "email-a barkod2021@gmail.com ili drustvenih mreza!")

        });

    }

</script>
<div class="container mx-auto mt-20 w-full">
    {#if showErrors}
        <div class="text-center my-2 text-red-600">
            Molimo vas odogovrite na sva pitanja i popunite sva polja da ne budu prazna, da bi ste se uspešno
            registrovali!
        </div>
    {/if}
    <div class="grid-rows-4 h-full">
        <div class="justify-self-center mb-4 text-center">
            <h1 class="text-4xl">Prijava za <span class="barkod">barKod</span> Hakaton!</h1>
        </div>
        <div class="justify-self-center mt-3 mx-10 md:mx-auto  sm:w-10/12 md:w-5/12 grid grid-cols-2">
            <div class="w-full mr-3 text-2xl">
                <button disabled="{showQuestionnaire}" on:click={() => teamType = 'solo'}
                        class="w-full rounded-xl p-1 h-full hover:bg-pink-800 bg-pink-700">Sam!
                </button>
            </div>
            <div class="w-full ml-3 text-2xl">
                <button disabled="{showQuestionnaire}" on:click={() => teamType = 'team'}
                        class="w-full h-full rounded-xl hover:bg-purple-800 bg-purple-700">Ja i još par drugara!
                </button>
            </div>
        </div>
        <div class="justify-self-center text-center mt-2">
            {#if showQuestionnaire}
                <Questionnaire questionnaire={questionnaire}/>
            {:else}
                {#if teamType === 'solo'}
                    <SoloRegister player={teamLead}/>
                {:else if teamType === 'team'}
                    <TeamRegister team={team}/>
                    <label class="text-gray-600">Vodja tima </label>
                    <SoloRegister player={teamLead}/>

                {:else}
                    <div class="temp mx-10 md:mx-auto  sm:w-10/12 md:w-5/12 my-4 grid">
                        <div class="disbaled-temp">
                            <span class="text-gray-500">... Odaberi prvo kako se prijavljuješ! ...</span>
                        </div>
                    </div>
                {/if}
            {/if}

        </div>

    </div>
    <div class="justify-self-center sm:w-4/5 md:w-1/3 justify-items-center mx-auto grid grid-cols-2">
        <div class="mx-1 text-xl">
            <button on:click={() => handleBack()}
                    class="w-full p-3 hover:bg-red-700 rounded bg-red-600 h-full">
                Nazad
            </button>
        </div>
        {#if showQuestionnaire}
            <div class="mx-1 text-xl">
                <button on:click={() => handleSubmit()}
                        class="w-full p-3 rounded hover:bg-green-700 bg-green-600 h-full">
                    Prijavi se
                </button>
            </div>
        {:else}
            <div class="mx-1 text-xl">
                <button on:click={() => showQuestionnaire = !showQuestionnaire}
                        class="w-full p-3 rounded hover:bg-green-700 bg-green-600 h-full">
                    Dalje
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    button:disabled {
        background-color: gray;
        user-select: none;
    }

    .disbaled-temp {
        font-size: 1.2rem;
        color: white;
        background-color: #212529;
        border-radius: 0.75rem;
        margin-left: 0.75rem;
        margin-right: 0.75rem;
    }

    .barkod {
        color: #C9196D;
    }

    .temp {
        height: 50vh;
    }
</style>