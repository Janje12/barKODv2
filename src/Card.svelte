<script>
    export let card;

    const targetType = card.link === 'faq' ? '' : '_blank';
</script>
<div id="{card.id}" class="bg-card px-4 py-2 rounded-md grid-rows-3 w-full shadow relative up-{card.bottom}">
    <div class="pt-2 text-xl">{card?.title}</div>
    <hr class="my-1">
    {#if card.subtitle}
        <div class="pb-2 text-gray-500"><h5>{card?.subtitle}</h5></div>
    {/if}
    <div class="{card.subtitle ? '' : 'py-3'} text-justify">
        {@html card?.text}
    </div>
    {#if card.icon}
        <div class="flex justify-end mt-2">
            <a target="{targetType}" href="{card?.link}"><i class="fa fa-{card?.icon}"></i>{card?.link_text}</a>
        </div>
    {/if}
</div>

<style>
    .bg-card {
        background-color: #212529;
    }

    .up-10 {
        bottom: 4rem;
    }

    .up-20 {
        bottom: 4rem;
    }

    .up-30 {
        bottom: 6rem;
    }

    .up-40 {
        bottom: 8rem;
    }
</style>