
export default function Breadcrumb() {
    return (
        <nav aria-label="breadcrumb" className="text-xl text-[#2b6534] bg-neutral-100 px-7 py-4">
            <ol className="flex space-x-2">
                <li>
                    <a href="/tai-chinh" className=" hover:underline">
                        Finance
                    </a>
                </li>
                <li>
                    <span className="text-[#2b6534]">›</span>
                </li>
                <li className="font-semibold ">Pay online</li>
            </ol>
        </nav>
    );
}
