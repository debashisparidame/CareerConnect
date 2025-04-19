function LandingPage() {
  return (
    <div className="h-screen overflow-hidden">
      <LandNavbar />
      <main className="h-screen pt-20"> {/* Add padding-top to account for fixed navbar */}
        <LandingHeroPage />
      </main>
    </div>
  );
}