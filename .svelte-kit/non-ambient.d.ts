
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/latihan" | "/latihan/[id]" | "/petunjuk";
		RouteParams(): {
			"/latihan/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/about": Record<string, never>;
			"/latihan": { id?: string };
			"/latihan/[id]": { id: string };
			"/petunjuk": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/latihan" | "/latihan/" | `/latihan/${string}` & {} | `/latihan/${string}/` & {} | "/petunjuk" | "/petunjuk/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/assets/README.md" | "/assets/audio/.gitkeep" | "/assets/fonts/.gitkeep" | "/assets/images/.DS_Store" | "/assets/images/.gitkeep" | "/assets/images/backgrounds/bg-1.png" | "/assets/images/backgrounds/bg-2.png" | "/assets/images/backgrounds/bg-about.png" | "/assets/images/backgrounds/bg-example.png" | "/assets/images/backgrounds/bg-guides.png" | "/assets/images/backgrounds/bg-home.png" | "/assets/images/buttons/button-home.png" | "/assets/images/buttons/button-play-home.png" | "/assets/images/buttons/button-play.png" | "/assets/images/buttons/next.png" | "/assets/images/buttons/previous.png" | "/assets/images/materials/bag.png" | "/assets/images/materials/correct-expression.png" | "/assets/images/materials/eraser.png" | "/favicon.png" | string & {};
	}
}