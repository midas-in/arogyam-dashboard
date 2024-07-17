const CustomModal = ({ isOpen, children }: { isOpen: boolean, children: React.ReactNode }) => {
    return <div className={`bg-[#1E1E1E4D] w-screen h-screen z-50 fixed top-0 right-0 bottom-0 flex items-center justify-center  ${!isOpen ? 'hidden' : 'no-scroll'}`}>
        {children}
    </div>
}
export { CustomModal }
