declare type VitePluginRequireTransformParamsType = {
    fileRegex?: RegExp;
    importPrefix?: string;
    importPathHandler?: Function;
};
declare function vitePluginRequireTransform(params?: VitePluginRequireTransformParamsType): {
    name: string;
    transform(code: string, id: string): Promise<{
        code: string;
        map: any;
    }>;
};

export { vitePluginRequireTransform as default };
