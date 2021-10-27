<script>
    export let questionnaire = {
        howDidYouHearAboutUs: '',
        didYouHearAboutSynechron: false,
        howDidYouHearAboutSynechron: '',
        didYouHearAboutDatum: false,
        howDidYouHearAboutDatum: '',
        objectOptions: '',
        tripleDoubleEquals: '',
        whatDoesSolidMean: '',
    };

    const marketOptions = [
        'Socijalne mreže (Instagram, Facebook)',
        'Linkedin',
        'Prijatelj/kolega',
        'Ostalo',
    ]
    const objectOptions = [
        'Super',
        'Object',
        'JavaCompiler'
    ]
    const equalsOptions = [
        'true',
        'false'
    ]
    const solidOptions = [
        'Don\'t repeat yourself',
        'Single-responsibility principle',
        'Lopatov granular control',
        'Open–closed principle',
        'Dependency inversion principle',
        'Object-oriented programming'
    ]

    function updateSynechron(answer) {
        questionnaire.howDidYouHearAboutSynechron = answer;
    }

    function updateDatum(answer) {
        questionnaire.howDidYouHearAboutDatum = answer;
    }

    const tmpSynechron = 'How did you hear about Synechron';
    const tmpDatum = 'How did you hear about Datum';

    function updateUs(answer) {
        questionnaire.howDidYouHearAboutUs = answer;
    }
</script>

<div class="grid-rows-6 mb-5">
    <div class=" my-2">
        <select on:change={(e) => updateUs(e.target.value)}>
            <option disabled hidden selected value="Kako si čuo za nas?">Kako si čuo za nas?</option>
            {#each marketOptions as m}
                <option value="{m}">{m}</option>
            {/each}
        </select>
    </div>
    <div class="grid-rows-2 my-2">
        <div>
            <label class="text-gray-400">Da li si čuo sa kompaniju <span class="purple">Synechron?</span></label>
            <input type="checkbox" bind:checked={questionnaire.didYouHearAboutSynechron}>
        </div>
        <div class="my-2">
            <select disabled={!questionnaire.didYouHearAboutSynechron}
                    on:change={(e) => updateSynechron(e.target.value)}>
                <option hidden selected value="Kako si čuo za Synechron?">Kako si čuo za Synechron?</option>
                {#each marketOptions as m}
                    <option value="{m}">{m}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="grid-rows-2 my-2">
        <div>
            <label class="text-gray-400">Da li si čuo sa kompaniju <span class="purple">Datum?</span></label>
            <input type="checkbox" bind:checked={questionnaire.didYouHearAboutDatum}>
        </div>
        <div class="my-2">
            <select disabled={!questionnaire.didYouHearAboutDatum}
                    on:change={(e) => updateDatum(e.target.value)}>
                <option hidden selected value="Kako si čuo za Datum?">Kako si čuo za Datum?</option>
                {#each marketOptions as m}
                    <option value="{m}">{m}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="grid-rows-2 my-2 md:mx-auto sm:w-10/12 md:w-4/12">
        <label class="text-gray-400">Koju klasu svaka klasa nasleđuje (direktno ili indirektno) u Javi?</label>
        <div class="grid-rows-3">
            {#each objectOptions as option}
                <label class="justify-self-start">
                    <input type="radio" bind:group="{questionnaire.objectOptions}"
                           value="{option}">
                    {option}
                </label>
            {/each}
        </div>
    </div>
    <div class="grid-rows-2 my-2 md:mx-auto sm:w-10/12 md:w-4/12">
        <label class="text-gray-400">Šta će izraz 1 == '1' && '42 === '42' vratiti u JavaScript-i?</label>
        <div class="grid-rows-2">
            {#each equalsOptions as option}
                <label class="justify-self-start">
                    <input type="radio" bind:group="{questionnaire.tripleDoubleEquals}"
                           value="{option}">
                    {option}
                </label>
            {/each}
        </div>
    </div>
    <div class="grid-rows-2 my-2 md:mx-auto sm:w-10/12 md:w-4/12">
        <label class="text-gray-400">Šta od navedenih spada pod SOLID principe (moguće je više od jednog tačnog odgovora)?</label>
        <div class="grid-rows-6 grid ml-7">
            {#each solidOptions as option}
                <label class="justify-self-start">
                    <input type="checkbox" bind:group="{questionnaire.whatDoesSolidMean}"
                           value="{option}">
                    {option}
                </label>
            {/each}
        </div>
    </div>
</div>

<style>
    input, select, option {
        font-size: 1.2rem;
        color: white;
        background-color: #212529;
        padding: 0.5rem;
        border-radius: 0.75rem;
        margin-left: 0.75rem;
        margin-right: 0.75rem;
    }

    .purple {
        color: #C9196D;

    }

    select:disabled {
        background-color: #313131 !important;
    }
</style>