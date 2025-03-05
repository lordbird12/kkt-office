import { APP_INITIALIZER, EnvironmentProviders, importProvidersFrom, inject, Provider } from '@angular/core';
import { Translation, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslocoHttpLoader } from 'app/core/transloco/transloco.http-loader';
import { environment } from 'environments/environment';

export const provideTransloco = (): Array<Provider | EnvironmentProviders> =>
{
    return [
        importProvidersFrom(TranslocoModule),
        {
            // Provide the default Transloco configuration
            provide : TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs      : [
                    {
                        id   : 'en',
                        label: 'English',
                    },
                    {
                        id   : 'tr',
                        label: 'ไทย',
                    },
                ],
                defaultLang         : 'tr',
                fallbackLang        : 'tr',
                reRenderOnLangChange: true,
                prodMode            : true,
            }),
        },
        {
            // Provide the default Transloco loader
            provide : TRANSLOCO_LOADER,
            useClass: TranslocoHttpLoader,
        },
        {
            // Preload the default language before the app starts to prevent empty/jumping content
            provide   : APP_INITIALIZER,
            deps      : [TranslocoService],
            useFactory: (translocoService: TranslocoService): any => (): Promise<Translation> => {
                const defaultLang = localStorage.getItem('lang') ?? translocoService.getDefaultLang();

                localStorage.setItem('lang', defaultLang);

                translocoService.setActiveLang(defaultLang);
                return translocoService.load(defaultLang).toPromise();
            },
            multi     : true
        }

        // {
        //     // Preload the default language before the app starts to prevent empty/jumping content
        //     provide   : APP_INITIALIZER,
        //     useFactory: () =>
        //     {
        //         const translocoService = inject(TranslocoService);
        //         const defaultLang = translocoService.getDefaultLang();
        //         translocoService.setActiveLang(defaultLang);

        //         return () => translocoService.load(defaultLang).toPromise();
        //     },
        //     multi     : true,
        // },
    ];
};
