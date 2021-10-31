<script>
    import Footer from "./Footer.svelte";
    import Header from "./Header.svelte";
    import Card from "./Card.svelte";

    let card1 = {
        title: 'Šta je hakaton?',
        text: 'Hakaton je takmičenje gde studenti i učenici učestvuju razvijanju rešenja za zadate probleme i učenju nečega novog usput. Svi su pozvani da dođu pošto će pored takmičenja biti i paneli kompanija koje se bave Informacionim tehnologijama!',
    }
    let card2 = {
        title: 'Kada se održava?',
        text: 'Hakaton će se održati 27. Novembra, a prijave su već otvorene. Šta čekaš <a class="text-pink-500" href="register">prijavi se!</a>',
    }
    let card3 = {
        title: 'Gde će se održati?',
        text: 'Hakaton će se održati na Departmanu matematike i informatike Prirodno-matematičkog fakulteta u Novom Sadu.',
    }
    let card4 = {
        title: 'Da li moram biti na student da bi učestovao?',
        text: 'Ne! Skoro svako ko je željan da nauči nešto novo u IT grani i mlađi je od 24 godine je dobrodošao!',
    }
    let card8 = {
        title: 'Koliki su timovi?',
        text: 'Timovi se sastoje od dva do tri člana.',
    }
    let card5 = {
        title: 'Da li su prijave moguće samo u timu?',
        text: 'Ne! Moguće je prijaviti se i kao pojedinac, i kao tim',
    }
    let card6 = {
        title: 'Hocu da pomognem!',
        text: 'Super =) uskoči na naš Discord i javi nam se, ili na bilo koje druge socijalne mreže!',
    }
    let card7 = {
        title: 'Hoću da dođem da se upoznam sa kompanijama ili bodrim takmičare da li treba da se prijavim negde?',
        text: 'Ne! Samo bani u toku dana, a za ostalo ćemo se mi pobrinuti!',
    }

    function goBack() {
        history.back();
    }
</script>
<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</svelte:head>
<div class="container-fluid mb-10 px-0 h-100">
    <div class="row">
        <Header/>
    </div>
    <div class="container mx-auto w-3/5 mt-3">
        <div class="my-3">
            <button on:click={() => goBack() } class="p-3 rounded border hover:bg-purple-700"><i class="fa fa-2x fa-arrow-left"></i></button>
        </div>
        <div class="my-3">
            <Card card={card1}/>
        </div>
        <div class="my-3">
            <Card card={card2}/>
        </div>
        <div class="my-3">
            <Card card={card3}/>
        </div>
        <div class="my-3">
            <Card card={card4}/>
        </div>
        <div class="my-3">
            <Card card={card8}/>
        </div>
        <div class="my-3">
            <Card card={card5}/>
        </div>
        <div class="my-3">
            <Card card={card6}/>
        </div>
        <div class="my-3">
            <Card card={card7}/>
        </div>
    </div>
</div>
<Footer/>
