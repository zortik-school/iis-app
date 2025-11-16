import type {PageArgs, PageResponse} from "./util.ts";

export interface Theme {
    id: number;
    name: string;
    description: string;
}

export type CreateThemeArgs = {
    name: string;
    description: string;
}

export type DeleteThemeArgs = {
    themeId: number;
}

export type GetThemeArgs = {
    themeId: number;
}

export type InspectThemeArgs = {
    themeId: number;
}

export type InspectThemeResponse = Theme;

export type UpdateThemeArgs = {
    themeId: number;
    name: string;
    description: string;
}

export type ListThemesArgs = PageArgs;

export type ListThemesResponse = PageResponse<Theme>;