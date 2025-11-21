import { AfterViewInit, Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-home-page',
  imports: [NavBarComponent, FooterComponent],
  templateUrl: './home-page.component.html',

})
export class HomePageComponent implements AfterViewInit {


  ngAfterViewInit(): void {

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(
          (e.currentTarget as HTMLAnchorElement).getAttribute('href')!
        );
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Parallax effect
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('section');
      if (hero && scrolled < window.innerHeight) {
        (hero as HTMLElement).style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });

  }

}
