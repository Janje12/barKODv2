<script>
    import SocialContainer from "./SocialContainer.svelte";
    import Logo from "./Logo.svelte";
</script>
<div class="grid-cols-3 grid">
    <div class="p-8 invisible grid-cols-2 md:visible">
        <p class="text-center mb-2">Powered by:</p>
        <a class="flex justify-center" href="https://www.synechron.com/" target="_blank"><img
                class="w-3/5 sponsor bg-white rounded-xl p-3"
                src="synechron-vector-logo.png"
                alt="synechron"/></a>
    </div>
    <div class="">
        <h3 class="flex md:w-1/3 w-2/3 mx-auto text-white justify-center">
            <Logo/>
        </h3>
        <h1 id="title" class="flex font-bold md:text-7xl text-5xl justify-center">
            HAKATON
        </h1>
        <SocialContainer/>
    </div>
    <div class="invisible p-8 md:visible">
        <div><p class="text-center">Partners:</p></div>
        <div class="grid grid-cols-2 ">
            <a class="flex justify-center" href="https://www.thecampster.com/rs/" target="_blank"><img
                    class="w-4/5 h-3/4 mt-3 sponsor bg-gray-300 rounded-xl p-3"
                    src="kampster.png"
                    alt="kampster"/></a>
            <a class="flex justify-center" href="https://www.guarana.rs/" target="_blank"><img
                    class="w-3/5 mt-3 sponsor bg-white rounded-xl p-3"
                    src="gua-logo.png"
                    alt="guarana"/></a>
            <a class="mx-auto" href="https://www.joberty.rs/" target="_blank"><img
                    class="w-3/5 mt-3 mx-auto sponsor bg-white rounded-xl p-3"
                    src="joberty_logo_coral.png"
                    alt="joberty"/></a>
            <a class="mx-auto" href="https://www.zabac.rs/" target="_blank"><img
                    class="w-3/5 mt-3 mx-auto sponsor bg-white rounded-xl p-3"
                    src="zabac.png"
                    alt="zabac"/></a>
        </div>
    </div>
</div>
<div class="md:hidden grid-rows-3 visible">
    <p class="text-center mb-2 text-gray-500">Powered by:</p>
    <div class="w-2/3  mx-auto grid">
        <a class="mx-1" href="https://www.synechron.com/" target="_blank"><img
                class="sponsor bg-white rounded-xl p-2"
                src="synechron-vector-logo.png"
                alt="synechron"/>
        </a>
    </div>
    <div class="grid-cols-2 grid">
        <a href="https://www.joberty.rs/" target="_blank">
            <img class="mt-3 w-2/3 ml-auto mr-1 sponsor bg-white rounded-xl p-3"
                 src="joberty_logo_coral.png"
                 alt="joberty"/></a>
        <a href="https://www.guarana.rs/" target="_blank">
            <img class="mt-3 w-2/3 mr-auto ml-1 sponsor bg-white rounded-xl p-3"
                 src="gua-logo.png"
                 alt="guarana"/></a>
        <a href="https://www.thecampster.com/rs/" target="_blank">
            <img class="mt-3 w-2/3 ml-auto mr-1 sponsor bg-gray-200 rounded-xl p-3"
                 src="kampster.png"
                 alt="kampster"/></a>
        <a href="https://www.zabac.rs/" target="_blank">
            <img class="mt-3 w-2/3 mr-auto ml-1 sponsor bg-white rounded-xl p-3"
                 src="zabac.png"
                 alt="zabac"/></a>
    </div>
</div>

<style>
    h1 {
        user-select: none;
        z-index: 2;
        color: #C9196D;
        text-shadow: 5px 2px 3px #9f004b;
    }

    .sponsor:hover {
        animation: scale 0.5s forwards;
    }

    @keyframes scale {
        from {
            background-color: white;
        }
        to {
            background-color: #707070;
        }
    }

    @-webkit-keyframes text-flicker-in-glow {
        0% {
            opacity: 0
        }
        10% {
            opacity: 0;
            text-shadow: none
        }
        10.1% {
            opacity: 1;
            text-shadow: none
        }
        10.2% {
            opacity: 0;
            text-shadow: none
        }
        20% {
            opacity: 0;
            text-shadow: none
        }
        20.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .25)
        }
        20.6% {
            opacity: 0;
            text-shadow: none
        }
        30% {
            opacity: 0;
            text-shadow: none
        }
        30.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        30.5% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        30.6% {
            opacity: 0;
            text-shadow: none
        }
        45% {
            opacity: 0;
            text-shadow: none
        }
        45.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        50% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        55% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        55.1% {
            opacity: 0;
            text-shadow: none
        }
        57% {
            opacity: 0;
            text-shadow: none
        }
        57.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .35)
        }
        60% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .35)
        }
        60.1% {
            opacity: 0;
            text-shadow: none
        }
        65% {
            opacity: 0;
            text-shadow: none
        }
        65.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .35), 0 0 100px rgba(53, 28, 115, .1)
        }
        75% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .35), 0 0 100px rgba(53, 28, 115, .1)
        }
        75.1% {
            opacity: 0;
            text-shadow: none
        }
        77% {
            opacity: 0;
            text-shadow: none
        }
        77.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .4), 0 0 110px rgba(53, 28, 115, .2), 0 0 100px rgba(53, 28, 115, .1)
        }
        85% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .4), 0 0 110px rgba(53, 28, 115, .2), 0 0 100px rgba(53, 28, 115, .1)
        }
        85.1% {
            opacity: 0;
            text-shadow: none
        }
        86% {
            opacity: 0;
            text-shadow: none
        }
        86.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .6), 0 0 60px rgba(53, 28, 115, .45), 0 0 110px rgba(53, 28, 115, .25), 0 0 100px rgba(53, 28, 115, .1)
        }
        100% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .6), 0 0 60px rgba(53, 28, 115, .45), 0 0 110px rgba(53, 28, 115, .25), 0 0 100px rgba(53, 28, 115, .1)
        }
    }

    @keyframes text-flicker-in-glow {
        0% {
            opacity: 0
        }
        10% {
            opacity: 0;
            text-shadow: none
        }
        10.1% {
            opacity: 1;
            text-shadow: none
        }
        10.2% {
            opacity: 0;
            text-shadow: none
        }
        20% {
            opacity: 0;
            text-shadow: none
        }
        20.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .25)
        }
        20.6% {
            opacity: 0;
            text-shadow: none
        }
        30% {
            opacity: 0;
            text-shadow: none
        }
        30.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        30.5% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        30.6% {
            opacity: 0;
            text-shadow: none
        }
        45% {
            opacity: 0;
            text-shadow: none
        }
        45.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        50% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        55% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .45), 0 0 60px rgba(53, 28, 115, .25)
        }
        55.1% {
            opacity: 0;
            text-shadow: none
        }
        57% {
            opacity: 0;
            text-shadow: none
        }
        57.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .35)
        }
        60% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .35)
        }
        60.1% {
            opacity: 0;
            text-shadow: none
        }
        65% {
            opacity: 0;
            text-shadow: none
        }
        65.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .35), 0 0 100px rgba(53, 28, 115, .1)
        }
        75% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .35), 0 0 100px rgba(53, 28, 115, .1)
        }
        75.1% {
            opacity: 0;
            text-shadow: none
        }
        77% {
            opacity: 0;
            text-shadow: none
        }
        77.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .4), 0 0 110px rgba(53, 28, 115, .2), 0 0 100px rgba(53, 28, 115, .1)
        }
        85% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .55), 0 0 60px rgba(53, 28, 115, .4), 0 0 110px rgba(53, 28, 115, .2), 0 0 100px rgba(53, 28, 115, .1)
        }
        85.1% {
            opacity: 0;
            text-shadow: none
        }
        86% {
            opacity: 0;
            text-shadow: none
        }
        86.1% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .6), 0 0 60px rgba(53, 28, 115, .45), 0 0 110px rgba(53, 28, 115, .25), 0 0 100px rgba(53, 28, 115, .1)
        }
        100% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(53, 28, 115, .6), 0 0 60px rgba(53, 28, 115, .45), 0 0 110px rgba(53, 28, 115, .25), 0 0 100px rgba(53, 28, 115, .1)
        }
    }

</style>