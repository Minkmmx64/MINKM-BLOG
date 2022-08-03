# 使用 Vuex mapState函数将store值映射为当前计算属性
import { mapState } from 'vuex'

computed:{
    ...mapState(['Attribute'])
}

# 使用 mutation 集中处理state数据，不建议直接修改store.state的数据 

mutations:{
    FunctionName(state,params){
        state.Attribute => [...params]
    }
}

触发 mutation 
1、store.commit('FunctionName',params)

不能在mutation执行异步操作

# 使用 Vuex mapMutations函数将mutation方法映射成 methods 函数方法
import { mapMutations } from 'vuex'

methods:{
    ...mapMutations['FunctionName1','FunctionName2']
}

调用： FunctionName1(params)

# 使用 Action 执行异步任务
只能在actions中调用mutations方法修改state数据
actions:{
    asyncFunction(store,params){
        setTimeout(()=>{
            store.commit('FunctionName',params)
        },1000)
    }
}

# 触发 Actions

1、store.dispatch('asyncFunction',params)

# 使用 Vuex mapActions 将Actions方法映射到 methods
import { mapActions } from 'vuex'

methods:{
    ...mapActions['asyncFunction']
}

# 使用 Getters 对state数据处理并返回,不会修改state内容
getters:{
    functionName:state => {
        return `${Attribute}balabala`
    }
}

store.getters.functionName()

# 使用 Vuex mapGetters 将getters值映射为当前计算属性

computed:{
    ...mapGetters(['functionName'])
}