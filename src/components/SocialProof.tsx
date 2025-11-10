export const SocialProof = () => {
  const companies = [
    { name: "Salesforce", initial: "S" },
    { name: "HubSpot", initial: "H" },
    { name: "Zendesk", initial: "Z" },
    { name: "Oracle", initial: "O" },
    { name: "Microsoft", initial: "M" },
    { name: "Adobe", initial: "A" },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-5xl text-center">
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 font-medium px-4">
          Trusted by sales professionals at leading companies
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 items-center">
          {companies.map((company) => (
            <div
              key={company.name}
              className="group flex items-center justify-center p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl glass-effect hover:border-primary transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center transition-all group-hover:scale-110 neon-border">
                  <span className="text-primary font-bold text-lg sm:text-xl">
                    {company.initial}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-foreground/60 group-hover:text-primary transition-colors">
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
