export interface PageArgs {
    page: {
        index: number;
        size: number;
    }
}

export interface PageResponse<T> {
    items: T[];
    page: {
        /**
         * The page index (zero-based).
         */
        index: number;
        /**
         * The size of the page (number of items per page).
         */
        size: number;
        /**
         * Total number of pages available.
         */
        totalPages: number;
    }
}