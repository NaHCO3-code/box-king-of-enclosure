import { generateUuidV4, addComponentTick, removeComponentTick, sortComponentsByWeight } from "./Implement";

/** 用于存储当前组件已启用的所有对象
 * 通过组件 uuid 可查询实例化对象本身
 */
export let componentObjByUuid: Map<string, Component> = new Map<string, Component>();

/**
 * 抽象类Component，作为所有组件的基类
 * 定义了组件的基本属性和生命周期方法
 */
export default abstract class Component {
    /** 组件是否启用 */
    private _enable: boolean = false;
    /** 组件的权重，用于决定更新顺序 */
    private _weight: number;
    /** 时间计数，用于记录经过的时间 */
    private _timeCount: number;
    /** 组件的启用次数 */
    private _enableCount: number = 0;
    /** 组件的禁用次数 */
    private _disableCount: number = 0;
    /** 组件的重置次数 */
    private _restoreCount: number = 0;
    /** 组件的唯一标识符，用于在运行时识别 */
    readonly uuid: string;

    /**
     * 构造函数
     */
    constructor(init?: {
        /** 组件的权重值，权重越大刷新优先级越高，默认为0  */
        weight?: number;
        /** 组件的总时间初始值，后续刷新间隔的毫秒数在此基础上累加，默认为0 */
        timeCount?: number;
    }) {
        this._weight = init?.weight ?? 0;
        this._timeCount = init?.timeCount ?? 0;
        this.uuid = generateUuidV4();
        this.onStart?.();
        this.onEnableIfNotEnabled();
    }

    /** 如果该组件第一次启用，则在组件 onUpdate 开始调用之前调用。<br/>
    * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。 
    */
    protected onStart?(): void;

    /** 在组件 onStart 执行后，每帧(30ms)更新时调用。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     * @param {number} deltaTime - 两次调用之间的时间间隔
     */
    protected onUpdate?(deltaTime: number): void;

    /** 启用组件时调用。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onEnable?(): void;

    /** 禁用组件时调用。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onDisable?(): void;

    /** 生命周期方法，当组件重置时调用。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
    */
    protected onRestore?(): void;

    /** 生命周期方法，当组件销毁时调用。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
    */
    protected onDestroy?(): void;

    /**
     * 如果组件未启动，则调用onEnable方法启动组件
     */
    private onEnableIfNotEnabled() {
        if (!this._enable) {
            this._enable = true;
            this._enableCount++;
            this.onEnable?.();
            if (this.onUpdate) {
                addComponentTick(this);
                if (this._weight) {
                    sortComponentsByWeight();
                }
            }
        }
    }

    /**
     * 获取当前组件的权重值
     * @returns {number} 当前组件的权重值
     */
    get weight(): number {
        return this._weight;
    }

    /**
     * 获取当前组件的重置次数
     * @returns {number} 当前组件的重置次数
     */
    get restoreCount(): number {
        return this._restoreCount;
    }

    /**
     * 获取当前组件的启用次数
     * @returns {number} 当前组件的启用次数
     */
    get enableCount(): number {
        return this._enableCount;
    }

    /**
     * 获取当前组件的禁用次数
     * @returns {number} 当前组件的禁用次数
     */
    get disableCount(): number {
        return this._disableCount;
    }

    /**
     * 设置当前组件的权重值
     * @param {number} w - 新的权重值
     */
    set weight(w: number) {
        if (this._weight === w) return;
        this._weight = w;
        if (this.onUpdate) {
            sortComponentsByWeight();
        }
    }

    /**
    * 获取当前组件的时间总时间值
    * @returns {number} 当前的总时间
    */
    get timeCount(): number {
        return this._timeCount;
    }

    /**
     * 设置当前组件的权重值
    * @param {number} t - 当前的总时间（ms）
     */
    set timeCount(t: number) {
        this._timeCount = t;
    }

    /**
     * 获取当前组件是否启用
     * @returns {boolean} 组件的启用状态
     */
    get enable(): boolean {
        return this._enable;
    }

    /**
     * 设置组件是否启用
     * @param {boolean} v - 组件的启用状态
     */
    set enable(v: boolean) {
        if (this._enable === v) return;
        this._enable = v;
        if (this._enable) { 
            // 这里Component的实现逻辑有误，此时_enable已经是true了，
            // 因此onEnableIfNotEnable内部逻辑根本不会被执行。这是临时的修复方案。
            this._enable = false;
            this.onEnableIfNotEnabled();
        } else {
            if (this.onUpdate) {
                removeComponentTick(this);
            }
            this._disableCount++;
            this.onDisable?.();
        }
    }

    /**
     * 销毁组件
     * @returns 如果组件已启动，则销毁组件并返回true，否则返回false
     */
    destroy(): boolean {
        if (!this._enable) return false;
        this._enable = false;
        this._disableCount++;
        if (this.onUpdate) {
            removeComponentTick(this);
        }
        this.onDisable?.();
        this.onDestroy?.();
        return true;
    }

    /**
     * 重置组件，组件不会干预重置权重，总时间等预设值。
     */
    restore() {
        this._restoreCount++;
        this.onRestore?.();
    }

    /**
     * 更新组件状态，一般由引擎触发
     * @param {number} deltaTime - 两次调用之间的时间间隔
     */
    update(deltaTime: number) {
        this._timeCount += deltaTime;
        this.onUpdate?.(deltaTime);
    }
}