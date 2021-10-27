<script>
    export let team = {
        teamName: '',
        teamAcronym: '',
        teamSize: 2,
        teamMembers: [{
            firstName: '',
            lastName: '',
            email: '',
        }]
    }
    $:teamMembers = [
        {
            firstName: '',
            lastName: '',
            email: '',
        },
    ];

    const updateTeam = (teamSize) => {
        teamMembers.length = 0
        team.teamSize = teamSize;
        for (let i = 0; i < teamSize - 1; i++) {
            teamMembers.push({
                firstName: '',
                lastName: '',
                email: '',
            });
        }
        team.teamMembers = teamMembers;
    }
</script>

<div class="grid-rows-3 sm:w-10/12 md:w-5/12 mx-auto">
    <div class="grid-cols-2 grid my-3 mx-2">
        <input class="rounded-xl my-1 p-2" type="text" bind:value={team.teamName} placeholder="Naziv tima">
        <input class="rounded-xl my-1 p-2" maxlength="3" type="text" bind:value={team.teamAcronym}
               placeholder="Skraćen naziv tima">
    </div>
    <div class="my-3 ml-3 md:w-3/12 sm:w-3/5">
        <label class="text-gray-500">Broj članova tima:</label>
            <select class="rounded-xl md:w-full p-2" on:change={(e) => updateTeam(e.target.value)}>
                <option selected value="2">2</option>
                <option value="3">3</option>
            </select>

    </div>
    <div class="my-3 mx-4">
        {#each teamMembers as t, i}
            <label class="text-gray-600">Član tima #{i + 2} </label>
            <div class="my-1 grid-cols-3 grid">
                <input class="rounded-xl md:mr-1 p-2" type="text" bind:value={t.firstName}
                       placeholder="Ime">
                <input class="rounded-xl p-2" type="text" bind:value={t.lastName}
                       placeholder="Prezime">
                <input class="rounded-xl md:ml-1  p-2" type="text" bind:value={t.email}
                       placeholder="Email">
            </div>
        {/each}
    </div>
</div>

<style>
    input, select, option {
        font-size: 1.2rem;
        color: white;
        padding: 0.5rem;
        background-color: #212529;
        border-radius: 0.75rem;
        margin-left: 0.75rem;
        margin-right: 0.75rem;
    }
</style>