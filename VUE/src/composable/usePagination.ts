import { computed, Ref, ref, SetupContext } from 'vue';

export function usePagination(total: Ref<number>, pageSize: Ref<number>, ctx: SetupContext<Record<string, any>>): {
    pagesReduce: () => void,
    pagesAdd: () => void,
    nowPages: Ref,
    paginationNumber: Ref
} {
    const nowPages = ref(1);

    const paginationNumber = computed(() => {
        return Math.ceil(total.value / pageSize.value);
    });
    function pagesReduce() {
        if (nowPages.value > 1) nowPages.value--;
        ctx.emit('pagesReduce', nowPages.value);
    }

    function pagesAdd() {
        if (nowPages.value < paginationNumber.value) nowPages.value++;
        ctx.emit('pagesAdd', nowPages.value);
    }
    return {
        pagesReduce,
        pagesAdd,
        nowPages,
        paginationNumber
    };
}