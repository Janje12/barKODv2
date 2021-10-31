<script>
    import Header from "./Header.svelte";
    import SignUpContainer from "./SignUpContainer.svelte";
    import CardRow from "./CardRow.svelte";
    import Card from "./Card.svelte";
    import Footer from "./Footer.svelte";

    let card1 = {
        id: 'Ko?',
        title: 'Ko smo mi?',
        subtitle: 'Mladi sa idejom',
        text: 'Grupa studenata koji su odlučili da se iscimaju i organizuju događaj koji će pomoći mladim programirima i kompanijama󠀮󠀮󠀮. Među nama su kolege koje su već našle posao, a ima i onih koji su shvatili da ih pak programiranje uopšte ne zanima.',
        bottom: 10,
        icon: 'comment',
        link_text: ' Upoznaj nas!',
        link: 'https://discord.gg/V6CBrenQ3Z'
    }
    let card2 = {
        id: 'Šta?',
        title: 'Šta organizujemo?',
        subtitle: 'Takmičenje',
        text: 'barKod predstavlja prilagođenu vrstu hakatona za početnike󠀮󠀮󠀮. Cilj ovog takmičenja jeste da mlade programere uputi u konkretne poslove koji ih čekaju prilikom početka karijere󠀮󠀮󠀮..',
        bottom: 20,
        icon: 'code',
        link_text: ' Više informacija',
        link: 'faq.html'
    }
    let card3 = {
        id: 'Kada?',
        title: 'Kada?',
        subtitle: '27. Novembar',
        text: 'Hakaton će biti održan 27. Novembra, dok mogućnost prijavljivanja počinje 27. Oktobra u 16:00 časova.',
        bottom: 30,
        icon: 'calendar',
        link_text: ' 27. Nov',
        link: 'https://www.google.com/calendar/render?\n' +
            'action=TEMPLATE\n' +
            '&text=barKod Hakaton\n' +
            '&dates=20211127T0800Z/20211127T2000Z\n' +
            '&details=Hakaton takmicenje na PMFu!\n' +
            '&location=Prirodno-matmatički fakultet\n'
    }
    let card4 = {
        id: 'Gde?',
        title: 'Gde?',
        subtitle: 'PMF',
        text: 'Hakaton će biti održan na Prirodno-matematičkom fakultetu u Novom Sadu na departmanu za matematiku i informatiku.',
        bottom: 40,
        icon: 'map-marker-alt',
        link_text: ' Fakultet',
        link: 'https://goo.gl/maps/Nq38kNEDERpjuVQU9'
    }

</script>
<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
</svelte:head>

<body>
<main>

    <Header/>
    <SignUpContainer/>
    <div class="w-10/12 mx-auto h-full grid grid-cols-4">
        <div>
            <CardRow question="Ko?" height="25"/>
            <Card card="{card1}"/>
        </div>
        <div>
            <CardRow question="Šta?" height="50"/>
            <Card card="{card2}"/>
        </div>
        <div>
            <CardRow question="Kada?" height="75"/>
            <Card card="{card3}"/>
        </div>
        <div>
            <CardRow question="Gde?" height="100"/>
            <Card card="{card4}"/>
        </div>
    </div>
</main>
<Footer/>
</body>

<style>
    .grid-cols-4 {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

    }

</style>