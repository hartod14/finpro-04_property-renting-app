import React from 'react'

type props = {
    setPage: React.Dispatch<React.SetStateAction<number>>
    setLimit?: React.Dispatch<React.SetStateAction<number>>
    page: number
    max?: any
    total: any
    limit?: number
    setLoading?: any
    totalPerPage?: any
    totalPage?: any
}

export const PaginationTable: React.FC<props> = props => {
    const { setPage, setLimit, page, totalPerPage, max, total, limit, setLoading, totalPage } = props

    // Helper function to scroll to top of page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Calculate current page display count
    const getDisplayedCount = () => {
        if (!limit) return total;
        const itemsOnCurrentPage = page === totalPage 
            ? total - (totalPage - 1) * limit 
            : limit;
        return Math.min(itemsOnCurrentPage, total);
    }

    const next = () => {
        if (totalPage > 1 && totalPage > page) {
            if (setLoading) {
                setLoading(true)
                setPage(page + 1)
            } else {
                setPage(page + 1)
            }
            scrollToTop();
        }
    }

    const prev = () => {
        if (page > 1) {
            if (setLoading) {
                setLoading(true)
                setPage(page - 1)
            } else {
                setPage(page - 1)
            }
            scrollToTop();
        } else {
            setPage(page - 1)
        }
    }

    const jumpToPage = (n: number) => {
        setPage(n)
        scrollToTop();
    }

    const generatePages = () => {
        let pages: (number | string)[] = [];
        const range = 2;

        if (totalPage <= 7) {
            pages = Array.from({ length: totalPage }, (_, i) => i + 1);
        } else {
            pages.push(1);
            if (page > range + 2) pages.push("...");

            for (let i = Math.max(2, page - range); i <= Math.min(totalPage - 1, page + range); i++) {
                pages.push(i);
            }

            if (page < totalPage - range - 1) pages.push("...");
            pages.push(totalPage);
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2">
            <div className='flex gap-2 items-center'>
                <div>
                    <p className="pr-2">Page <span className='font-semibold'>{page}</span> of <span className='font-semibold'>{totalPage}</span> • <span className='font-semibold'>{total}</span> Results</p>
                </div>

                <button
                    onClick={prev}
                    disabled={page > 1 ? false : true}
                    className={`focus:outline-none disabled:cursor-not-allowed w-8 h-8 flex justify-center items-center rounded-lg ${page > 1 ? 'bg-primary' : 'bg-[#C8CED5]'
                        }`}
                >
                    <svg width="11" height="19" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.5029 20.5378C12.8212 20.2417 13 19.8402 13 19.4216C13 19.0029 12.8212 18.6014 12.5029 18.3054L4.09834 10.4905L12.5029 2.67556C12.8122 2.3778 12.9833 1.979 12.9794 1.56505C12.9756 1.1511 12.797 0.755126 12.4822 0.462409C12.1674 0.169692 11.7415 0.00365778 11.2964 6.05414e-05C10.8512 -0.0035367 10.4223 0.155595 10.1021 0.44318L0.497118 9.37428C0.178813 9.67034 -4.77685e-07 10.0718 -4.59386e-07 10.4905C-4.41087e-07 10.9091 0.178813 11.3106 0.497118 11.6067L10.1021 20.5378C10.4205 20.8337 10.8523 21 11.3025 21C11.7527 21 12.1845 20.8337 12.5029 20.5378Z"
                            fill="#FFFFFF"
                        />
                    </svg>
                </button>
                {generatePages().map((p, index) => (
                    <span
                        key={index}
                        onClick={() => typeof p === "number" && jumpToPage(p)}
                        className={`cursor-pointer w-8 h-8 flex justify-center items-center font-semibold rounded-lg border-2 ${p === page
                            ? "bg-primary text-white border-secondary"
                            : "bg-white border-[#DFE3E8]"
                            }`}
                    >
                        {p}
                    </span>
                ))}
                <button
                    disabled={totalPage > 1 && totalPage > page ? false : true}
                    onClick={next}
                    className={`focus:outline-none w-8 h-8 disabled:cursor-not-allowed flex justify-center items-center rounded-lg ${totalPage > 1 && totalPage > page ? 'bg-primary' : 'bg-[#C8CED5]'
                        }`}
                >
                    <svg width="11" height="19" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.49712 0.462242C0.178815 0.758305 9.02978e-07 1.1598 8.84679e-07 1.57843C8.6638e-07 1.99706 0.178815 2.39856 0.49712 2.69462L8.90166 10.5095L0.497119 18.3244C0.187835 18.6222 0.016698 19.021 0.0205661 19.4349C0.0244351 19.8489 0.202999 20.2449 0.517801 20.5376C0.832603 20.8303 1.25846 20.9963 1.70364 20.9999C2.14882 21.0035 2.57771 20.8444 2.89793 20.5568L12.5029 11.6257C12.8212 11.3297 13 10.9282 13 10.5095C13 10.0909 12.8212 9.6894 12.5029 9.39334L2.89793 0.462242C2.57953 0.166268 2.14775 -4.74367e-07 1.69753 -4.94047e-07C1.24731 -5.13726e-07 0.815521 0.166268 0.49712 0.462242Z"
                            fill="#F5F6F9"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}
