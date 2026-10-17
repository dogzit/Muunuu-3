import { Lightbox } from "@/components/Lightbox";
import { Nav, View } from "@/components/Router";
import { Home } from "@/components/views/Home";
import { Notes } from "@/components/views/Notes";
import { Photoshoot } from "@/components/views/Photoshoot";
import { Scrapbook } from "@/components/views/Scrapbook";

export default function Page() {
  return (
    <>
      <Nav />
      <View name="home"><Home /></View>
      <View name="scrapbook"><Scrapbook /></View>
      <View name="photoshoot"><Photoshoot /></View>
      <View name="notes"><Notes /></View>
      <div className="flash" id="flash"></div>
      <Lightbox />
    </>
  );
}
