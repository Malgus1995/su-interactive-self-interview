import { RpgClientEngine } from "./RpgClientEngine.js";
/**
* Get/Set images in resources
 ```ts
    import { RpgResource } from '@rpg/client'
    const fileLink = RpgResource.spritesheets.get('resource_id')
  ```
* @title Get/Set image link
* @prop { Map< string, string > } spritesheets
* @memberof Resources
*/
/**
* Get/Set sounds in resources
 ```ts
    import { RpgResource } from '@rpg/client'
    const fileLink = RpgResource.sounds.get('resource_id')
  ```
* @title Get/Set sound link
* @prop { Map< string, string > } sounds
* @memberof Resources
*/
export declare function _initResource(memory: Map<string, any>, _resources: any, prop: string, engine: RpgClientEngine): void;
