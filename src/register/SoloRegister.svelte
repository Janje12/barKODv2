<script>
    export let player = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        faculty: '',
        facultyPlace: '',
        yearOfStudy: '',
        dob: new Date(),
        occupation: '',
    };

    const NOVI_SAD_FACULTY = [
        'Prirodno-matetmatički fakultet',
        'Fakultet tehničkih nauka',
        'Visoka tehnička škola',
    ];

    const BEOGRAD_FACULTY = [
        'Matetmatički fakultet',
        'Elektrotehnički fakultet',
        'Visoka škola elektrotehinke i računarstva',
    ];

    let tmpFacultyPlace = 'Odaberi grad fakulteta';

    function updateFacultyPlace(facultyPlace) {
        if (facultyPlace === 'Novi Sad')
            faculties = NOVI_SAD_FACULTY;
        if (facultyPlace === 'Beograd')
            faculties = BEOGRAD_FACULTY;
        player.faculty = '';
        tmpFacultyPlace = facultyPlace;
        if (facultyPlace === 'Upiši sam')
            player.facultyPlace = '';
        else
            player.facultyPlace = facultyPlace;
    }

    let tmpFaculty = 'Odaberi fakultet'
    let faculties = NOVI_SAD_FACULTY;

    function updateFaculty(faculty) {
        tmpFaculty = faculty;
        if (faculty === 'Upiši sam')
            player.faculty = '';
        else
            player.faculty = faculty;
    }


</script>
<div class="grid-rows-6 mx-10 md:mx-auto sm:w-10/12 md:w-5/12 mb-3 mx-auto">
    <div class="grid grid-cols-2 mx-5 my-3">
        <input class="rounded-xl mr-1 p-2" maxlength="100" required type="text" bind:value={player.firstName} placeholder="Ime">
        <input class="rounded-xl ml-1 p-2" maxlength="100" required type="text" bind:value={player.lastName} placeholder="Prezime">
    </div>
    <div class="grid grid-cols-2 mx-5  my-3">
        <input class="rounded-xl mr-1 my-1 p-2" maxlength="100" required type="text" bind:value={player.email} placeholder="Email">
        <input class="rounded-xl ml-1 my-1 p-2" maxlength="100" required type="text" bind:value={player.phone} pattern="[0-9]+"
               oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" placeholder="Telefon">
    </div>
    <div class="my-3 mx-5">
        <label class="text-gray-500 flex justify-self-start">Datum rođenja</label>
        <input class="rounded-xl w-full p-2" type="date" bind:value={player.dob}>
    </div>
    <div class="my-3 mx-5">
        <select class="rounded-xl w-full p-2" required on:change={(e) => player.occupation = e.target.value}>
            <option disabled hidden selected value="Odaberi zanimanje">Odaberi zanimanje</option>
            <option value="učenik">Učenik</option>
            <option value="student">Student</option>
            <option value="nezaposlen">Nezaposlen</option>
            <option value="zaposlen">Zaposlen</option>
        </select>
    </div>
    {#if player.occupation === 'student'}
        <div class="grid grid-rows-3">
            <div class="mx-5 my-1">
                <select name="selectFacultyPlace" required class="rounded-xl w-full p-2" on:change={(e) => updateFacultyPlace(e.target.value)}>
                    <option selected hidden disabled value="Odaberi grad fakulteta">Odaberi grad fakulteta</option>
                    <option value="Novi Sad">Novi Sad</option>
                    <option value="Beograd">Beograd</option>
                    <option value="Upiši sam">Upiši sam</option>
                </select>
                {#if tmpFacultyPlace === 'Upiši sam'}
                    <input class="rounded-xl mt-3 w-full p-2" maxlength="100" type="text" placeholder="Grad fakulteta" bind:value={player.facultyPlace}>
                {/if}
            </div>
            <div class="mx-5 my-2">
                <select name="selectFaculty" required class="rounded-xl w-full p-2" on:change={(e) => updateFaculty(e.target.value)}>
                    <option hidden disabled selected value="Odaberi fakultet">Odaberi fakultet</option>
                    {#each faculties as f}
                    <option value="{f}">{f}</option>
                        {/each}
                    <option value="Upiši sam">Upiši sam</option>
                </select>
                {#if tmpFaculty === 'Upiši sam'}
                    <input class="rounded-xl mt-3 w-full p-2" maxlength="100" placeholder="Naziv fakulteta" type="text" bind:value={player.faculty}>
                {/if}
            </div>
            <div class="mx-5 my-2">
                <select class="rounded-xl w-full p-2" required bind:value={player.yearOfStudy}>
                    <option selected value="I">Prva godina</option>
                    <option value="II">Druga godina</option>
                    <option value="III">Treća godina</option>
                    <option value="IV">Četvrta godina</option>
                    <option value="Master">Master</option>
                    <option value="Doktorske">Doktorske</option>
                </select>
            </div>
        </div>
    {/if}
</div>

<style>
    input, select, option {
        font-size: 1.2rem;
        color: white;
        background-color: #212529;
    }
</style>