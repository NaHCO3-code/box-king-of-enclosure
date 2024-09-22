
import Component, { componentObjByUuid } from "./Definition";

// 初始化上次更新日期为当前时间
let lastUpdateDate = Date.now();

// // 主逻辑刷新间隔 默认0.0334秒（模拟30帧一秒）
// setInterval(() => {
//     let dt = Date.now() - lastUpdateDate;   
//     lastUpdateDate = Date.now();
//     componentObjByUuid.forEach(component => {
//         component.update(dt);
//     });
// }, 0.0334 * 1000);

world.onTick(({elapsedTimeMS}) => {
    componentObjByUuid.forEach(component => {
        component.update(elapsedTimeMS);
    });
})

/** 移除组件的更新 */
export function removeComponentTick(component: Component): void {
    componentObjByUuid.delete(component.uuid);
}

/** 添加组件的更新 */
export function addComponentTick(component: Component): void {
    componentObjByUuid.set(component.uuid, component);
}

/** 根据组件权重进行排序，这样做是为了确保组件按照其权重的降序进行处理，权重较高的组件将首先被访问 */
export function sortComponentsByWeight() {
    const sortedValues: Component[] = Array.from(componentObjByUuid.values());
    sortedValues.sort((a: Component, b: Component) => b.weight - a.weight);
    componentObjByUuid.clear();
    for (const component of sortedValues) {
        componentObjByUuid.set(component.uuid, component);
    }
}

/** 生成一个UUID版本4的唯一标识符 */
export function generateUuidV4(): string {
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return uuid;
}

