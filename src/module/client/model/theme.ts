import type {PageArgs, PageResponse} from "./util.ts";

export interface Theme {
    id: number;
    name: string;
    description: string;
}

export type ListThemesArgs = PageArgs;

export type ListThemesResponse = PageResponse<Theme>;