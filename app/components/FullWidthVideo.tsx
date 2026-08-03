export type FullWidthVideoProps = {
  videoUrl?: string;
  posterUrl?: string;
};

export function FullWidthVideo(
    {
    videoUrl="/images/homePage/main.mp4",
    posterUrl   ="/images/homePage/main-poster.webp",
}: FullWidthVideoProps = {}
){
    return (
        <section className="w-full">
            <video
                className=" block w-full h-auto"
                videoUrl={videoUrl}
                posterUrl={posterUrl}   
                aria-label="Phoenix Gravity Wasserfilter"   
                autoPlay
                muted
                loop
                playsInline
                controls={false}
            >
                <source src={videoUrl} type="video/mp4" />
            </video>
        </section>
    )
}
