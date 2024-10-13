import { InjectContext, HookClient, loadModules } from '@rpgjs/common';
import { RpgClientEngine } from './RpgClientEngine.js';
import { setInject } from './inject.js';
export default (modules, options) => {
    if (!options.globalConfig)
        options.globalConfig = {};
    options = {
        ...options.globalConfig,
        ...options
    };
    const relations = {
        onInit: HookClient.AddSprite,
        onDestroy: HookClient.RemoveSprite,
        onUpdate: HookClient.UpdateSprite,
        onChanges: HookClient.ChangesSprite,
        onMove: HookClient.SpriteMove
    };
    const relationsMap = {
        onAddSprite: HookClient.SceneAddSprite,
        onRemoveSprite: HookClient.SceneRemoveSprite,
        onBeforeLoading: HookClient.BeforeSceneLoading,
        onAfterLoading: HookClient.AfterSceneLoading,
        onMapLoading: HookClient.SceneMapLoading,
        onChanges: HookClient.SceneOnChanges,
        onDraw: HookClient.SceneDraw
    };
    const relationsEngine = {
        onStart: HookClient.Start,
        onStep: HookClient.Step,
        onConnected: HookClient.Connected,
        onDisconnect: HookClient.Disconnect,
        onConnectError: HookClient.ConnectedError,
        onInput: HookClient.SendInput,
        onWindowResize: HookClient.WindowResize
    };
    loadModules(modules, {
        side: 'client',
        relations: {
            player: relations,
            sceneMap: relationsMap,
            engine: relationsEngine
        }
    });
    const context = new InjectContext();
    setInject(context);
    return context.inject(RpgClientEngine, [options]);
};
//# sourceMappingURL=clientEntryPoint.js.map