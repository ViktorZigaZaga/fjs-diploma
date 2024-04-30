export default function getPageCount(totalCount: number, limit: number) {
    return Math.ceil(totalCount / limit);
}