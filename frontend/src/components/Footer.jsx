import { footerLinks } from "../assets/assets";

const Footer = () => {


    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                <h1 className="font-bold md:text-3xl sm:text-2xl bg-gradient-to-r from-green-600 via-pink-500 to-orange-600 bg-clip-text text-transparent">
          GROOFY
        </h1>
                    <p className="max-w-[410px] mt-6">Groofy is owned, operate and managed by Groofy private limited company and it is 
                        best in this market sector. We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we
                        aim to make your shopping experience simple and affordable.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © Groofy All Right Reserved.
            </p>
        </div>
    );
};

export default Footer;