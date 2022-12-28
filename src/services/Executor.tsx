export default class Executor {

    undoQueue: Array<() => void>
    redoQueue: Array<() => void>

    constructor(){
        this.undoQueue = []
        this.redoQueue = []
    }
    execute(fn: ()=> void , undoFn:() => void){
        fn()
        this.undoQueue.push(() => {
            undoFn()
            this.redoQueue.push(fn)
        })
    }
    undo(){
        if (this.undoQueue.length > 0) {
            this.undoQueue?.pop()?.()
        }
    }
    redo(){
        if (this.redoQueue.length > 0) {
            this.redoQueue.pop()?.()
        }
    }
}