export default function TableEnrty({title, value}: {title: string, value: string}) {
    if (!value) return null;
    return (
        <tr className="flex justify-between gap-8 text-right">
            <td className="text-neutral-400">{title}</td>
            <td>{value}</td>
        </tr>
    );
}