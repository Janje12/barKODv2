<script>
    let email = '';
    let d = '0';
    let h = '00';
    let m = '00';
    let s = '00';
    const fun = updateTimer => {
        const future = Date.parse("nov 27, 2021 09:00:00");
        const now = new Date();
        const diff = future - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor(diff / (1000 * 60));
        const secs = Math.floor(diff / 1000);

        d = days;
        h = hours - days * 24;
        m = mins - hours * 60;
        s = secs - mins * 60;
    }
    setInterval(fun, 1000);

    function handleRegister() {
        window.location.href = "register?email=" + email;
    }

</script>
<div class="mb-28 pt-5 flex px-12 lg:pl-60">
    <div class="grid-rows-2 w-4/5">
        <div class="mb-8">
            <div class="mb-8">
                <h1 class="text-2xl md:text-3xl">Prijave su zatvorene! <span class="font-bold text-pink-700"> Do hakatona: </span>
                </h1>
            </div>
            <div class="mr-0">
                <span class="countdown-span-1 block md:inline my-1 p-1 md:p-3 md:text-xl rounded">{d} DANA</span>
                <span class="countdown-span-2 block md:inline my-1 p-1 md:p-3 md:text-xl  rounded">{h} SATI</span>
                <span class="countdown-span-3 block md:inline my-1 p-1 md:p-3 md:text-xl  rounded">{m} MINUTA</span>
                <span class="countdown-span-4 block md:inline p-1 md:p-3 md:text-xl  rounded">{s} SEKNUDI</span>
            </div>

        </div>
    </div>
</div>

    <style>
        .countdown-span-1 {
            background-color: #C9196D;
        }

        .countdown-span-2 {
            background-color: #8a2357;
        }

        .countdown-span-3 {
            background-color: #531c73;
        }

        .countdown-span-4 {
            background-color: #351C73FF
        }

    </style>