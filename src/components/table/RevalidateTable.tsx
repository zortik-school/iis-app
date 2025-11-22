import {Button, Stack, Table, Box, Typography, Sheet} from "@mui/joy";
import type {PageResponse} from "../../module/client/model/util.ts";
import {type ReactNode, useCallback, useEffect, useState} from "react";

export interface RevalidateTableProps<T> {
    integrityKey: number;
    revalidate: (pageIndex: number) => Promise<PageResponse<T>>;
    children: (items: T[]) => ReactNode;
}

export const RevalidateTable = <T,>(
    {integrityKey, revalidate, children}: RevalidateTableProps<T>
) => {
    const [fetching, setFetching] = useState(false);
    const [data, setData] = useState<PageResponse<T>|null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const controlsDisabled = fetching || !data;

    const switchPage = useCallback((page: number) => {
        if (fetching) {
            return;
        }

        setFetching(true);
        setCurrentPage(page);
        setData(null);

        revalidate(page)
            .then((newData) => setData(newData))
            .finally(() => setFetching(false));
    }, [fetching, revalidate]);

    useEffect(() => {
        (async () => {
            setFetching(true);

            try {
                const initialData = await revalidate(0);

                setData(initialData);
            } finally {
                setFetching(false);
            }
        })();
    }, [integrityKey, revalidate]);

    const handlePrev = () => {
        if (fetching || !data) {
            return;
        }
        if (currentPage <= 0) {
            return;
        }

        switchPage(currentPage - 1);
    };
    const handleNext = () => {
        if (fetching || !data) {
            return;
        }
        if (currentPage + 1 >= data.page.totalPages) {
            return;
        }

        switchPage(currentPage + 1);
    };

    return (
        <>
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: 4,
                }}
            >
                <Table
                    borderAxis="x"
                    size="md"
                    hoverRow
                    sx={{
                        tableLayout: 'auto',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                    }}
                >
                    {fetching && (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography sx={{ p: 2 }}>Loading...</Typography>
                        </Box>
                    )}
                    {!fetching && data && children(data.items)}
                </Table>
            </Sheet>

            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button onClick={handlePrev} disabled={controlsDisabled || currentPage === 0}>
                    Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={controlsDisabled || currentPage + 1 >= Math.ceil(data.page.totalPages)}
                >
                    Next
                </Button>
            </Stack>
        </>
    );
};