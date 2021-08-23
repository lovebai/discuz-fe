export default function checkProps(data) {
    if (!data || !data.site || !data.site.webConfig) {
        return false;
    }
    return true;
}